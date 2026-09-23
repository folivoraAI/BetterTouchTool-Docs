#!/usr/bin/env python3
"""Check public BTT references against a local app checkout on macOS.

Checks mirrored JSON references, JSON plugin examples and Swift code blocks.
Compiles/links temporary libraries with the shipped bridge and warnings as
errors. Never loads libraries, installs plugins, launches BTT or publishes docs.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
import re
import shlex
import subprocess
import sys
import tempfile

SITE = Path(__file__).resolve().parent.parent
MIRRORS = {
    'action-definitions.mdx': 'actions/action-definitions.mdx',
    'trigger-definitions.mdx': 'json/trigger-definitions.mdx',
    'floating-menu-definitions.mdx': 'json/floating-menu.mdx',
}
PLUGIN_TYPES = {
    'action-plugins': ('BTTActionPluginInterface', 'BTTActionPluginDelegate'),
    'trigger-plugins': ('BTTTriggerPluginInterface', 'BTTTriggerPluginDelegate'),
    'stream-deck-plugins': ('BTTStreamDeckPluginInterface', 'BTTStreamDeckPluginDelegate'),
    'touch-bar-plugins': ('BTTPluginInterface', 'BTTTouchBarPluginDelegate'),
    'launcher-plugins': ('BTTLauncherPluginInterface', 'BTTLauncherPluginDelegate'),
}


def fenced_blocks(text, language):
    for match in re.finditer(r'^```' + language + r'\s*\n(.*?)^```', text, re.M | re.S):
        yield text[:match.start()].count('\n') + 1, match[1]


def contextual_swift(page, block):
    """Supply only the enclosing class/inputs omitted by a documented fragment."""
    protocol, delegate = PLUGIN_TYPES.get(page, ('BTTFloatingMenuWidgetInterface', 'BTTFloatingMenuWidgetDelegate'))
    members = re.search(r'^(?:(?:static|private|override)\s+)*func\s', block, re.M) is not None
    properties = '''
    let label = NSTextField(labelWithString: "Example")
    var labelText = "Example", content = "Example"
    var count = 0
'''
    defaults = ''
    if page == 'action-plugins':
        properties += '    var completionBlock: (@Sendable (Any?) -> Void)?\n'
        defaults = '''
    static func configurationFormItems() -> BTTPluginFormItem? { nil }
    func executeAction(withConfiguration config: [AnyHashable: Any]?, completionBlock: (@Sendable (Any?) -> Void)?) { completionBlock?(nil) }
'''
    elif page == 'trigger-plugins':
        defaults = '''
    static func triggerName() -> String { "Probe" }
    static func triggerDescription() -> String { "Compile-only probe" }
    static func triggerIcon() -> String { "star" }
    static func configurationFormItems() -> BTTPluginFormItem? { nil }
    func didReceiveNewConfigurationValues(_ config: [AnyHashable: Any]?) {}
    func startObserving() {}
    func stopObserving() {}
'''
    elif page == 'launcher-plugins':
        if not members:
            protocol = None
            delegate = 'BTTLauncherPluginSurfaceDelegate'
        properties += '''
    let context = BTTLauncherPluginContext()
    let name = "Example", urlTemplate = "https://example.com"
    // External provider implementations are outside these API fragments.
    func searchExternalProvider(query: String) -> [BTTLauncherPluginResult] { [] }
    func loadAccountRows() -> [BTTLauncherPluginResult] { [] }
'''
    if not members:
        for name in ('value', 'resolved'):
            if re.search(r'\blet ' + name + r'\s*=', block):
                block += '\n_ = ' + name + ' // consumed by the surrounding plugin\n'
        block = 'func check() {\n' + block + '\n}'
    inheritance = 'NSObject' + (', ' + protocol if protocol else '')
    return ('import Cocoa\nclass Probe: ' + inheritance + ' {\n' +
            'weak var delegate: (any ' + delegate + ')?\n' + properties + defaults + block + '\n}\n')


def fingerprint(paths):
    digest = hashlib.sha256()
    for path in sorted(paths):
        digest.update(str(path).encode() + b'\0' + path.read_bytes() + b'\0')
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--btt-root', type=Path,
                        default=SITE.parents[1] / 'BetterTouchTool/BetterTouchTool',
                        help='App directory containing Code/ and notarization/')
    parser.add_argument('--report', type=Path, help='Save individual results as JSON')
    parser.add_argument('--schema', type=Path, help='Current native schema dump, including identity names, for publication checks')
    parser.add_argument('--skip-swift', action='store_true', help='Only run mirror/JSON checks')
    args = parser.parse_args()
    app = args.btt_root.expanduser().resolve()
    if not (app / 'notarization/audit_ai_plugin_guidance.py').is_file():
        parser.error('--btt-root must point to a BTT checkout with the AI guidance audit')
    sys.path.insert(0, str(app / 'notarization'))
    import audit_ai_plugin_guidance as plugins
    import audit_ai_configuration as configuration
    from run_ai_configuration_tests import schema_validation_error

    schema = None
    if args.schema:
        args.schema = args.schema.expanduser().resolve()
        error = schema_validation_error(args.schema, configuration.source_fingerprint())
        if error:
            recovery = shlex.join([sys.executable, str(app / 'notarization/run_ai_configuration_tests.py'),
                                   '--ensure-schema', '--schema', str(args.schema)])
            parser.error(f'Cannot use native schema {args.schema}: {error}\n'
                         f'Generate or refresh it with:\n  {recovery}')
        try:
            schema = json.loads(args.schema.read_text())
        except (OSError, UnicodeError, ValueError) as error:
            parser.error(f'Cannot read native schema {args.schema}: {error}')

    pages = sorted((SITE / 'docs/plugins').glob('*.mdx'))
    mirrors = [SITE / 'docs' / target for target in MIRRORS.values()]
    stamp = fingerprint(pages + mirrors + [Path(__file__).resolve()])
    app_stamp = plugins.source_fingerprint()
    errors = []
    for source, target in MIRRORS.items():
        if (SITE / 'docs' / target).read_bytes() != (app / 'Code/AI/Resources' / source).read_bytes():
            errors.append('Reference drift: docs/' + target)
    reference_report = configuration.audit_references(paths=mirrors, schema=schema)
    errors.extend(reference_report['errors'])
    declaration_count, enum_count, bridge_errors = plugins.header_contract()
    errors.extend(bridge_errors)
    types, fields = plugins.json_form_contract()
    json_count, json_plugins, jobs = 0, 0, []
    complete_types = set()
    for path in pages:
        text = path.read_text()
        if path.stem == 'json-action-plugins':
            for form_type in set(re.findall(r'`(BTTFormType\w+)`', text)) - types:
                errors.append(path.name + ': unsupported JSON form constant ' + form_type)
        for line, block in fenced_blocks(text, 'json'):
            label = str(path.relative_to(SITE)) + ':' + str(line)
            try:
                value = json.loads(block)
                json_count += 1
                if isinstance(value, dict) and all(key in value for key in ('BTTPluginMetadata', 'BTTPluginFormFields', 'BTTPluginActions')):
                    json_plugins += 1
                    errors.extend(label + ': ' + e for e in plugins.validate_json_plugin(value, types, fields))
                elif isinstance(value, dict) and 'formFieldType' in value:
                    # Validate a form-field fragment in an otherwise empty plugin.
                    wrapper = {'BTTPluginMetadata': {'BTTPluginName': 'Probe', 'BTTPluginIdentifier': 'com.example.probe'},
                               'BTTPluginFormFields': [value], 'BTTPluginActions': []}
                    errors.extend(label + ': ' + e for e in plugins.validate_json_plugin(wrapper, types, fields))
            except (TypeError, ValueError) as error:
                errors.append(label + ': ' + str(error))
        for line, block in fenced_blocks(text, 'swift'):
            # A metadata-only illustration is not a plugin or executable snippet.
            if not re.sub(r'//[^\n]*', '', block).strip():
                continue
            label = str(path.relative_to(SITE)) + ':' + str(line)
            complete = '// BTT-Plugin-Type:' in block
            if complete:
                prefix = '\n'.join(block.splitlines()[:50])
                kind_match = re.search(r'^// BTT-Plugin-Type:\s*(\w+)', prefix, re.M)
                protocol = plugins.PROTOCOLS.get(kind_match[1]) if kind_match else None
                if kind_match:
                    complete_types.add(kind_match[1])
                if not protocol or not re.search(r'class\s+\w+\s*:[^\n]*\b' + protocol + r'\b', block):
                    errors.append(label + ': type metadata and discoverable principal class disagree')
                if not re.search(r'^// BTT-Plugin-Identifier:\s*\S+', prefix, re.M):
                    errors.append(label + ': missing stable identifier in first 50 lines')
            code = block if complete else contextual_swift(path.stem, block)
            jobs.append((label, 'complete example' if complete else 'contextual snippet', code))

    for missing in plugins.PROTOCOLS.keys() - complete_types:
        errors.append('No complete public Swift example for ' + missing)
    if not json_plugins:
        errors.append('No complete public JSON plugin example found')

    results = []
    compiler_version = None
    if not args.skip_swift:
        sdk = subprocess.check_output(['/usr/bin/xcrun', '--sdk', 'macosx', '--show-sdk-path'], text=True).strip()
        swiftc = subprocess.check_output(['/usr/bin/xcrun', '--find', 'swiftc'], text=True).strip()
        compiler_version = subprocess.check_output([swiftc, '--version'], text=True).strip()
        with tempfile.TemporaryDirectory(prefix='btt-public-plugin-docs-') as temporary:
            directory = Path(temporary)
            def compile_one(entry):
                index, (label, kind, code) = entry
                name = 'Example' + str(index)
                source = directory / (name + '.swift')
                source.write_text(code)
                result = subprocess.run([swiftc, '-emit-library', '-warnings-as-errors',
                    '-module-name', name, '-sdk', sdk,
                    '-import-objc-header', str(app / 'Code/BTTSwiftPluginHeader.h'),
                    '-Xlinker', '-undefined', '-Xlinker', 'dynamic_lookup',
                    '-o', str(directory / (name + '.dylib')), str(source)], capture_output=True, text=True)
                return {'example': label, 'kind': kind, 'passed': result.returncode == 0,
                        'diagnostics': result.stdout + result.stderr}
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(compile_one, enumerate(jobs)))
        for result in results:
            if not result['passed']:
                errors.append('Swift compile failed: ' + result['example'] + '\n' + result['diagnostics'])
    if fingerprint(pages + mirrors + [Path(__file__).resolve()]) != stamp or plugins.source_fingerprint() != app_stamp:
        errors.append('Docs or app source changed during verification; rerun the check')
    report = {'valid': not errors, 'errors': errors, 'mirroredReferences': len(mirrors),
              'configurationExamples': reference_report['configurationExamples'],
              'pluginJSONBlocks': json_count, 'completeJSONPlugins': json_plugins,
              'completeSwiftPluginTypes': sorted(complete_types),
              'matchingBridgeDeclarations': declaration_count, 'matchingLauncherEnums': enum_count,
              'swiftChecks': results, 'swiftChecksSkipped': args.skip_swift,
              'swiftCompiler': compiler_version, 'docsFingerprint': stamp, 'appFingerprint': app_stamp,
              'limits': 'Compile/link and structural checks only. Fragments use enclosing types, sample inputs and empty external-provider stubs. No plugin is loaded, installed or executed; no UI or hardware behavior or full native schema coverage is verified.'}
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + '\n')
    for result in results:
        print(('PASS ' if result['passed'] else 'FAIL ') + result['example'] + ' (' + result['kind'] + ')')
    print(f"{len(mirrors)} mirrors; {reference_report['configurationExamples']} configuration examples; "
          f'{json_count} plugin JSON blocks; {len(results)} Swift checks; {len(errors)} errors.')
    for error in errors:
        print(error)
    return 0 if not errors else 1


if __name__ == '__main__':
    raise SystemExit(main())
