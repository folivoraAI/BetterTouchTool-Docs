#!/usr/bin/env python3
"""Publish built documentation to BTT's existing AI search service.

--check validates all inputs and credentials without resetting or ingesting.
Uses Docusaurus permalinks, includes .md and .mdx pages, and refreshes both the
documentation index and the legacy JSON-reference index over HTTPS.
"""
import argparse
import json
from pathlib import Path
import sys
from urllib.error import HTTPError
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

SITE = Path(__file__).resolve().parent.parent
API = 'https://ai-docs.llo.ai'
PUBLIC = 'https://docs.folivora.ai'
JSON_REFERENCES = {
    'actions/action-definitions.mdx': 'action-definitions',
    'json/trigger-definitions.mdx': 'trigger-definitions',
    'json/floating-menu.mdx': 'floating-menu-definitions',
}


def prepare_documents(site):
    docs = (site / 'docs').resolve()
    metadata = site / '.docusaurus/docusaurus-plugin-content-docs/default'
    global_data = json.loads((site / '.docusaurus/globalData.json').read_text())
    versions = global_data['docusaurus-plugin-content-docs']['default']['versions']
    current = next(version for version in versions if version['name'] == 'current')
    active = {doc['id']: doc['path'] for doc in current['docs']}
    records = {}
    urls = set()
    for file in sorted(metadata.glob('*.json')):
        record = json.loads(file.read_text())
        # Docusaurus can retain metadata for renamed/deleted pages in its cache.
        if record.get('id') not in active:
            continue
        source = record.get('source', '')
        if not source.startswith('@site/docs/'):
            continue
        relative = source.removeprefix('@site/docs/')
        path = (docs / relative).resolve()
        if not path.is_relative_to(docs) or path.suffix not in {'.md', '.mdx'}:
            raise ValueError('Invalid documentation source in ' + file.name)
        permalink = record.get('permalink', '')
        if permalink != active[record['id']]:
            raise ValueError('Stale permalink metadata for ' + relative)
        parsed = urlparse(permalink)
        if parsed.scheme or parsed.netloc or not permalink.startswith('/docs/') or parsed.query or parsed.fragment:
            raise ValueError('Invalid public permalink for ' + relative)
        output = (site / 'build' / unquote(parsed.path).lstrip('/') / 'index.html').resolve()
        if not output.is_relative_to((site / 'build').resolve()) or not output.is_file():
            raise ValueError('Built page missing for ' + relative + ': ' + permalink)
        if relative in records or permalink in urls:
            raise ValueError('Duplicate source or permalink: ' + relative)
        text = path.read_text()
        if not text.strip():
            raise ValueError('Empty document: ' + relative)
        records[relative] = {'text': text, 'meta': {'fullDocURL': PUBLIC + permalink}}
        urls.add(permalink)
    expected = {str(p.relative_to(docs)) for p in docs.rglob('*')
                if p.is_file() and p.suffix in {'.md', '.mdx'}}
    if not records or set(records) != expected:
        raise ValueError('Build metadata does not cover the documentation sources; rebuild before publishing. '
                         + ', '.join(sorted(expected - records.keys())))
    references = {}
    for relative, name in JSON_REFERENCES.items():
        record = records[relative]
        references[relative] = {'text': record['text'], 'meta': {**record['meta'], 'source': name}}
    return records, references


def post(route, secret, payload=None):
    body = json.dumps(payload or {}).encode()
    request = Request(API + route, data=body, method='POST',
                      headers={'Content-Type': 'application/json', 'x-admin-secret': secret})
    with urlopen(request, timeout=60) as response:
        return response.read()


def preflight(secret):
    # This authenticated endpoint rejects empty text before embedding or writing.
    try:
        post('/json_ingest', secret, {'text': ''})
    except HTTPError as error:
        if error.code == 400 and 'text is required' in error.read().decode():
            return
        raise RuntimeError('AI search preflight returned HTTP ' + str(error.code)) from None
    raise RuntimeError('Unexpected AI search preflight response')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Validate inputs/authentication without writing')
    args = parser.parse_args()
    try:
        documents, references = prepare_documents(SITE)
        secret = (Path.home() / '.btt-aidocs-secret').read_text().strip()
        if not secret:
            raise ValueError('AI search credential file is empty')
        preflight(secret)
        print(f'Prepared {len(documents)} documentation pages and {len(references)} JSON references.', flush=True)
        if args.check:
            print('Permalinks, built pages and HTTPS credentials verified; no data changed.')
            return 0
        for title, reset, ingest, records in [
            ('documentation', '/reset', '/ingest', documents),
            ('JSON references', '/json_reset', '/json_ingest', references),
        ]:
            print('Refreshing ' + title + ' index...', flush=True)
            post(reset, secret)
            for index, (relative, record) in enumerate(sorted(records.items()), 1):
                post(ingest, secret, record)
                print(f'[{index}/{len(records)}] Indexed {relative}', flush=True)
        print('Both AI search indexes updated successfully.', flush=True)
        return 0
    except HTTPError as error:
        # Do not retry ambiguous writes: a timed-out response may have committed.
        print('AI search publication failed with HTTP ' + str(error.code)
              + '. Review the last completed document before retrying.', file=sys.stderr)
    except Exception as error:
        print('AI search publication failed: ' + str(error), file=sys.stderr)
    return 1


if __name__ == '__main__':
    raise SystemExit(main())
