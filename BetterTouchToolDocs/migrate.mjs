#!/usr/bin/env node
/**
 * Migration script: HonKit/GitBook → Docusaurus 3
 * Transforms 127 flat markdown files into categorized .mdx with proper frontmatter,
 * JSX-compatible HTML, Vimeo embed components, and rewritten links.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_SRC = path.join(__dirname, 'docs');
const DOCS_OUT = path.join(__dirname, 'docs_new');
const STATIC_OUT = path.join(__dirname, 'static_new');

// ─── FILE_MAP ────────────────────────────────────────────────────────
// Maps every source .md file to { dir, slug, title, position }.
// Derived from SUMMARY.md hierarchy + orphan placement.

const FILE_MAP = {
  // ── Root ──
  'README.md': { dir: '', slug: '/docs/intro', title: 'Introduction', position: 1, filename: 'intro' },

  // ── Getting Started ──
  '1_installation.md': { dir: 'getting-started', slug: '/docs/getting-started/installation', title: 'Installation / Deinstallation', position: 1 },

  // ── Configuration ──
  '1b_preferences_chapter.md': { dir: 'configuration', slug: '/docs/configuration/overview', title: 'BTT Configuration', position: 1, isIndex: true },
  '2_preferences_basic_overview.md': { dir: 'configuration', slug: '/docs/configuration/basic-overview', title: 'Basic Overview', position: 2 },
  '3_preferences_new_trigger.md': { dir: 'configuration', slug: '/docs/configuration/new-trigger', title: 'Setting up a new Trigger', position: 3 },
  '2_2_preferences_global_vs_app_specific.md': { dir: 'configuration', slug: '/docs/configuration/global-vs-app-specific', title: 'Global and App Specific Triggers', position: 4 },
  '4_preferences_presets.md': { dir: 'configuration', slug: '/docs/configuration/presets', title: 'Presets', position: 5 },
  '5_settings.md': { dir: 'configuration', slug: '/docs/configuration/settings', title: 'Other Settings', position: 6 },
  '5_restoring_automatic_backups.md': { dir: 'configuration', slug: '/docs/configuration/restoring-backups', title: 'Restoring Automatic Backups', position: 7 },

  // ── Actions ──
  '6_2_shortcuts_integration.md': { dir: 'actions', slug: '/docs/actions/shortcuts-integration', title: 'Shortcuts Integration', position: 1 },
  '6_predefined_actions.md': { dir: 'actions', slug: '/docs/actions/overview', title: 'Predefined Actions', position: 2, isIndex: true },
  '7_sending_shortcuts.md': { dir: 'actions', slug: '/docs/actions/sending-shortcuts', title: 'Sending Keyboard Shortcuts', position: 3 },
  '8_clipboardmanager.md': { dir: 'actions', slug: '/docs/actions/clipboard-manager', title: 'Clipboard Manager', position: 4 },
  '8b_paste_type_custom_text.md': { dir: 'actions', slug: '/docs/actions/paste-custom-text', title: 'Insert / Type / Paste Custom Text', position: 5 },
  '8c_text_transformer_functions.md': { dir: 'actions', slug: '/docs/actions/text-transformer', title: 'JS Text Transformer Functions', position: 6 },
  '9_screenshots.md': { dir: 'actions', slug: '/docs/actions/screenshots', title: 'Screenshots', position: 7 },
  '6c_show_custom_context_menu.md': { dir: 'actions', slug: '/docs/actions/custom-context-menu', title: 'Show Custom Context Menu', position: 8 },
  '6c_choose_from_list_prompt.md': { dir: 'actions', slug: '/docs/actions/choose-from-list', title: 'Show List To Choose From', position: 9 },
  '6b_finder_context_menu.md': { dir: 'actions', slug: '/docs/actions/finder-context-menu', title: 'Extending Finder Context Menu', position: 10 },
  '6e_manage_menubar_status_items.md': { dir: 'actions', slug: '/docs/actions/manage-menubar-items', title: 'Manage Menu Bar Status Items', position: 11 },
  '1400_conditions.md': { dir: 'actions', slug: '/docs/actions/conditions', title: 'Trigger Conditions & Conditional Activation Groups', position: 12 },
  '6a_control_flow_actions.md': { dir: 'actions', slug: '/docs/actions/control-flow', title: 'Control Action Sequence Flow', position: 13 },
  'screenshot_tool.md': { dir: 'actions', slug: '/docs/actions/screenshot-tool', title: 'Screenshot Tool', position: 14 },

  // ── AI Assistants ──
  '3000_hallo_ai.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/overview', title: 'h@llo.AI - AI Assistants', position: 1, isIndex: true },
  '3002_halloai_getting_started.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/getting-started', title: 'Getting Started', position: 2 },
  '3001_halloai_example_assistants.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/example-assistants', title: 'Preconfigured Example Assistants', position: 3 },
  '3001_hallo_ai_api_keys.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/api-keys', title: 'Retrieve API Keys', position: 4 },
  '3009_halloai_tools.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/tools', title: 'Tools', position: 5 },
  '3008_halloai_context.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/context', title: 'Context', position: 6 },
  '3003_providing_initial_screenshot_or_message.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/initial-screenshot', title: 'Providing Initial Screenshot / Message', position: 7 },
  '3012_halloai_mcp.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/mcp', title: 'MCP', position: 8 },
  '3010_halloai_usage_without_ui.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/usage-without-ui', title: 'Usage Without UI', position: 9 },
  '3007_embedding_floating_menus.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/embedding-floating-menus', title: 'Embedding Floating Menus', position: 10 },
  '3013_halloai_subagents.md': { dir: 'ai-assistants', slug: '/docs/ai-assistants/subagents', title: 'Specialized Sub Agents', position: 11 },

  // ── Window Snapping ──
  '100_window_snapping_chapter.md': { dir: 'window-snapping', slug: '/docs/window-snapping/overview', title: 'Window Snapping', position: 1, isIndex: true },
  '101_window_snapping.md': { dir: 'window-snapping', slug: '/docs/window-snapping/basic-setup', title: 'Basic Window Snapping Setup', position: 2 },
  '102_window_snapping_advanced.md': { dir: 'window-snapping', slug: '/docs/window-snapping/advanced', title: 'Advanced Customization Options', position: 3 },
  '103_window_snapping_gestures.md': { dir: 'window-snapping', slug: '/docs/window-snapping/gestures', title: 'Snapping with Gestures or Shortcuts', position: 4 },
  '104_snap_areas.md': { dir: 'window-snapping', slug: '/docs/window-snapping/snap-areas', title: 'Custom Snap Areas', position: 5 },
  '105_window_moving.md': { dir: 'window-snapping', slug: '/docs/window-snapping/moving-resizing', title: 'Window Moving and Resizing', position: 6 },

  // ── Keyboard Shortcuts ──
  '201_keyboard_shortcuts.md': { dir: 'keyboard-shortcuts', slug: '/docs/keyboard-shortcuts/overview', title: 'Keyboard Shortcut Triggers', position: 1, isIndex: true },
  '1004_hyper_key.md': { dir: 'keyboard-shortcuts', slug: '/docs/keyboard-shortcuts/hyper-key', title: 'Defining a Hyper Key', position: 2 },
  '1005_low_level_keyremap.md': { dir: 'keyboard-shortcuts', slug: '/docs/keyboard-shortcuts/low-level-remap', title: 'Low Level Key Remapping', position: 3 },
  '4003_logitech_keyboards.md': { dir: 'keyboard-shortcuts', slug: '/docs/keyboard-shortcuts/logitech-keyboards', title: 'Logitech Keyboard Support', position: 4 },
  '301_keysequences.md': { dir: 'keyboard-shortcuts', slug: '/docs/keyboard-shortcuts/key-sequences', title: 'Key Sequence Triggers', position: 5 },

  // ── Touch Bar ──
  '401_touch_bar.md': { dir: 'touch-bar', slug: '/docs/touch-bar/overview', title: 'Touch Bar Triggers', position: 1, isIndex: true },
  '402_touch_bar_basics.md': { dir: 'touch-bar', slug: '/docs/touch-bar/basics', title: 'Touch Bar Basics', position: 2 },
  '403_touch_bar_widgets.md': { dir: 'touch-bar', slug: '/docs/touch-bar/widgets', title: 'Touch Bar Widgets', position: 3 },
  '404_touchbar_gestures.md': { dir: 'touch-bar', slug: '/docs/touch-bar/gestures', title: 'Touch Bar Gestures', position: 4 },
  '405_touch_bar_advanced.md': { dir: 'touch-bar', slug: '/docs/touch-bar/advanced', title: 'Touch Bar Advanced Configuration', position: 5 },

  // ── Trackpad & Mouse ──
  '601_magic_mouse_trackpad.md': { dir: 'trackpad-mouse', slug: '/docs/trackpad-mouse/magic-mouse-trackpad', title: 'Magic Mouse & Trackpad Triggers', position: 1 },
  '701_drawings.md': { dir: 'trackpad-mouse', slug: '/docs/trackpad-mouse/drawings', title: 'Drawings / Mouse Gestures', position: 2 },

  // ── BTT Mobile ──
  '501_bttremote.md': { dir: 'btt-mobile', slug: '/docs/btt-mobile/remote', title: 'BTT Mobile', position: 1 },

  // ── Floating Menus ──
  '1600_floating_menus.md': { dir: 'floating-menus', slug: '/docs/floating-menus/overview', title: 'Floating Menu & Desktop Widgets', position: 1, isIndex: true },
  '1601_floating_menu_basics.md': { dir: 'floating-menus', slug: '/docs/floating-menus/basics', title: 'Basics', position: 2 },
  '1609_showing_hiding_floating_menus.md': { dir: 'floating-menus', slug: '/docs/floating-menus/showing-hiding', title: 'Showing and Hiding', position: 3 },
  '1602_floating_menu_item_types.md': { dir: 'floating-menus', slug: '/docs/floating-menus/item-types', title: 'Item Types', position: 4 },
  '1603_scripting_floating_menus.md': { dir: 'floating-menus', slug: '/docs/floating-menus/scripting', title: 'Menu Scripting', position: 5 },
  '1606_floating_menu_update.md': { dir: 'floating-menus', slug: '/docs/floating-menus/updating-properties', title: 'Updating Item Properties', position: 6 },
  '1605_desktop_widgets.md': { dir: 'floating-menus', slug: '/docs/floating-menus/desktop-widgets', title: 'Desktop Widgets', position: 7 },
  '1604_keyboard_shortcuts_floating_menus.md': { dir: 'floating-menus', slug: '/docs/floating-menus/keyboard-shortcuts', title: 'Keyboard Shortcuts for Floating Menus', position: 8 },

  // ── Normal Mouse ──
  '801_normal_mice.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/overview', title: 'Normal Mouse & Logitech', position: 1, isIndex: true },
  '802_normal_mice_assigning_actions.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/assigning-actions', title: 'Assigning Actions to Buttons', position: 2 },
  '4000_logitech.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/logitech', title: 'Logitech Mouse Support', position: 3 },
  '4002_logitech_js.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/logitech-javascript', title: 'Logitech JavaScript', position: 4 },
  '4001_scroll_modifiers.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/scroll-modifiers', title: 'Scroll Modifiers', position: 5 },
  'normal_mice_problems.md': { dir: 'normal-mouse', slug: '/docs/normal-mouse/troubleshooting', title: 'Help: Mouse Buttons Not Recognized', position: 6 },

  // ── Other Triggers ──
  '1001_other.md': { dir: 'other-triggers', slug: '/docs/other-triggers/overview', title: 'Other & Named Triggers', position: 1, isIndex: true },
  '1009_text_selection_did_change.md': { dir: 'other-triggers', slug: '/docs/other-triggers/text-selection', title: 'Text Selection Did Change', position: 2 },
  '1010_text_selection_did_change_widgets.md': { dir: 'other-triggers', slug: '/docs/other-triggers/text-selection-widgets', title: 'Text Selection Did Change Widgets', position: 3 },
  '1002_named_triggers.md': { dir: 'other-triggers', slug: '/docs/other-triggers/named-triggers', title: 'Reusable Named Triggers', position: 4 },
  '1003_did_open_url.md': { dir: 'other-triggers', slug: '/docs/other-triggers/url-triggers', title: 'BTT as Default Browser / URL Based Triggers', position: 5 },
  '1008_custom_statusbar_items.md': { dir: 'other-triggers', slug: '/docs/other-triggers/statusbar-items', title: 'Custom Menubar Status Items', position: 6 },
  '901_siri_remote.md': { dir: 'other-triggers', slug: '/docs/other-triggers/siri-remote', title: 'Siri Remote Triggers', position: 7 },
  'apple_remote.md': { dir: 'other-triggers', slug: '/docs/other-triggers/apple-remote', title: 'Old Apple Remote', position: 8 },
  'leap.md': { dir: 'other-triggers', slug: '/docs/other-triggers/leap-motion', title: 'Leap Motion', position: 9 },

  // ── Scripting ──
  '1101_scripting_btt.md': { dir: 'scripting', slug: '/docs/scripting/overview', title: 'Scripting BetterTouchTool', position: 1, isIndex: true },
  '1102_apple_script.md': { dir: 'scripting', slug: '/docs/scripting/apple-script', title: 'Using Apple Script or JXA', position: 2 },
  '1106_java_script.md': { dir: 'scripting', slug: '/docs/scripting/java-script', title: 'Using Java Script (not JXA)', position: 3 },
  '1103_custom_url_scheme.md': { dir: 'scripting', slug: '/docs/scripting/url-scheme', title: 'Using Custom URL Scheme', position: 4 },
  '1104_webserver.md': { dir: 'scripting', slug: '/docs/scripting/webserver', title: 'Using HTTP Requests / Webserver', position: 5 },
  '1109_cli.md': { dir: 'scripting', slug: '/docs/scripting/cli', title: 'Command Line Interface', position: 6 },
  '1105_variables.md': { dir: 'scripting', slug: '/docs/scripting/variables', title: 'Available Standard Variables', position: 7 },
  '1108_simple_format.md': { dir: 'scripting', slug: '/docs/scripting/simple-format', title: 'Simple JSON Format', position: 8 },
  '1107_useful_scripts.md': { dir: 'scripting', slug: '/docs/scripting/useful-scripts', title: 'Useful Script Examples', position: 9 },

  // ── JSON ──
  '1999_json_definitions.md': { dir: 'json', slug: '/docs/json/overview', title: 'JSON Definitions', position: 1, isIndex: true },
  '2000_all_actions_details_json.md': { dir: 'json', slug: '/docs/json/action-definitions', title: 'Action JSON Definitions', position: 2 },
  '2001_floating_menu_json.md': { dir: 'json', slug: '/docs/json/floating-menu', title: 'Floating Menu JSON Definitions', position: 3 },
  '2002_trigger_json.md': { dir: 'json', slug: '/docs/json/trigger-definitions', title: 'Trigger JSON Definitions', position: 4 },
  '2003_json_examples.md': { dir: 'json', slug: '/docs/json/examples', title: 'JSON Examples', position: 5 },
  '2004_script_examples.md': { dir: 'json', slug: '/docs/json/script-examples', title: 'Script Examples', position: 6 },

  // ── Menubar ──
  '1700_menubar_status_items.md': { dir: 'menubar', slug: '/docs/menubar/status-items', title: 'Manage Menubar Status Items', position: 1 },

  // ── WebView ──
  '10_0_floating_html_menu.md': { dir: 'webview', slug: '/docs/webview/overview', title: 'Custom Scriptable WebView', position: 1, isIndex: true },
  '10_1_webview_basic_setup.md': { dir: 'webview', slug: '/docs/webview/basic-setup', title: 'Basic Setup', position: 2 },
  '10_1_webview_config.md': { dir: 'webview', slug: '/docs/webview/config', title: 'Appearance & Config Options', position: 3 },
  '10_2_floating_menu_javascript.md': { dir: 'webview', slug: '/docs/webview/javascript', title: 'Call BTT Functions from the WebView', position: 4 },
  '10_3_webview_scripts.md': { dir: 'webview', slug: '/docs/webview/scripts', title: 'Apple Scripts & Shell Scripts', position: 5 },
  '10_3_1_shortcuts.md': { dir: 'webview', slug: '/docs/webview/shortcuts', title: 'Shortcuts from the Shortcuts App', position: 6 },
  '10_4_webview_lifecycle.md': { dir: 'webview', slug: '/docs/webview/lifecycle', title: 'WebView Lifecycle & Notifications', position: 7 },
  '10_5_webview_starter_template.md': { dir: 'webview', slug: '/docs/webview/starter-template', title: 'Starter Template', position: 8 },
  '10_6_webview_development.md': { dir: 'webview', slug: '/docs/webview/development', title: 'Development Hints', position: 9 },

  // ── Stream Deck ──
  '1300_stream_deck.md': { dir: 'stream-deck', slug: '/docs/stream-deck/overview', title: 'Stream Deck', position: 1, isIndex: true },
  '1301_stream_deck_standard_button.md': { dir: 'stream-deck', slug: '/docs/stream-deck/standard-button', title: 'Standard Button & Formatting', position: 2 },
  '1302_stream_deck_long_press.md': { dir: 'stream-deck', slug: '/docs/stream-deck/long-press', title: 'Long Press', position: 3 },
  '1303_stream_deck_repeat.md': { dir: 'stream-deck', slug: '/docs/stream-deck/key-repeat', title: 'Key Repeat', position: 4 },
  '1304_changing_buttons_while_holding.md': { dir: 'stream-deck', slug: '/docs/stream-deck/hold-to-show', title: 'Hold to Show More', position: 5 },
  '1305_stream_deck_specific_devices.md': { dir: 'stream-deck', slug: '/docs/stream-deck/specific-devices', title: 'Bind to Device', position: 6 },
  '1306_stream_deck_groups.md': { dir: 'stream-deck', slug: '/docs/stream-deck/groups', title: 'Groups', position: 7 },
  '1307_stream_deck_pedal.md': { dir: 'stream-deck', slug: '/docs/stream-deck/pedal', title: 'Stream Deck Pedal', position: 8 },
  '1308_stream_deck_app_specific.md': { dir: 'stream-deck', slug: '/docs/stream-deck/app-specific', title: 'App Specific Configurations', position: 9 },
  '1309_script_widgets.md': { dir: 'stream-deck', slug: '/docs/stream-deck/script-widgets', title: 'Script Widgets', position: 10 },
  '1310_custom_swift_plugins.md': { dir: 'stream-deck', slug: '/docs/stream-deck/swift-plugins', title: 'Custom Swift Plugins', position: 11 },

  // ── Generic Devices ──
  '1500_generic_devices.md': { dir: 'generic-devices', slug: '/docs/generic-devices/overview', title: 'Generic Devices', position: 1, isIndex: true },
  '1501_generic_device_examples.md': { dir: 'generic-devices', slug: '/docs/generic-devices/examples', title: 'Example Device Scripts', position: 2 },

  // ── Notch Bar ──
  '1200_notch_bar.md': { dir: 'notch-bar', slug: '/docs/notch-bar/overview', title: 'Notch Bar (Deprecated)', position: 1, isIndex: true },
  '1201_notch_bar_setup.md': { dir: 'notch-bar', slug: '/docs/notch-bar/setup', title: 'Notch Bar Setup', position: 2 },
  '1203_notch_bar_placement.md': { dir: 'notch-bar', slug: '/docs/notch-bar/placement', title: 'Notch Bar Placement', position: 3 },
  '1202_notch_bar_customization.md': { dir: 'notch-bar', slug: '/docs/notch-bar/customization', title: 'Notch Bar Customization', position: 4 },
};

// ─── CATEGORY METADATA ──────────────────────────────────────────────
const CATEGORIES = {
  'getting-started':    { label: 'Getting Started',                      position: 2 },
  'configuration':      { label: 'BTT Configuration',                    position: 3 },
  'actions':            { label: 'Actions',                              position: 4 },
  'ai-assistants':      { label: 'h@llo.AI - AI Assistants',             position: 5 },
  'window-snapping':    { label: 'Window Snapping',                      position: 6 },
  'keyboard-shortcuts': { label: 'Keyboard Shortcuts',                   position: 7 },
  'touch-bar':          { label: 'Touch Bar',                            position: 8 },
  'trackpad-mouse':     { label: 'Trackpad & Mouse',                    position: 9 },
  'btt-mobile':         { label: 'BTT Mobile',                          position: 10 },
  'floating-menus':     { label: 'Floating Menu & Desktop Widgets',     position: 11 },
  'normal-mouse':       { label: 'Normal Mouse & Logitech',             position: 12 },
  'other-triggers':     { label: 'Other & Named Triggers',              position: 13 },
  'scripting':          { label: 'Scripting BetterTouchTool',           position: 14 },
  'json':               { label: 'JSON Definitions',                    position: 15 },
  'menubar':            { label: 'Menubar',                             position: 16 },
  'webview':            { label: 'Custom Scriptable WebView',           position: 17 },
  'stream-deck':        { label: 'Stream Deck',                        position: 18 },
  'generic-devices':    { label: 'Generic Devices',                    position: 19 },
  'notch-bar':          { label: 'Notch Bar (Deprecated)',             position: 20 },
};

// ─── BUILD REVERSE LOOKUP MAP ────────────────────────────────────────
// Maps old filenames (with and without .md, with and without docs/ prefix) to new slugs.
function buildReverseLookup() {
  const map = {};
  for (const [src, meta] of Object.entries(FILE_MAP)) {
    const slug = meta.slug;
    // Add multiple lookup keys
    map[src] = slug;                                          // README.md
    map[src.replace('.md', '')] = slug;                       // README
    map[`./docs/${src}`] = slug;                              // ./docs/README.md
    map[`docs/${src}`] = slug;                                // docs/README.md
    map[`./${src}`] = slug;                                   // ./README.md
    map[`./docs/${src.replace('.md', '')}`] = slug;
    map[`docs/${src.replace('.md', '')}`] = slug;
  }
  // Alias for broken link in SUMMARY.md: 1308_stream_deck_appspecific → actual file
  map['1308_stream_deck_appspecific.md'] = FILE_MAP['1308_stream_deck_app_specific.md'].slug;
  map['1308_stream_deck_appspecific'] = FILE_MAP['1308_stream_deck_app_specific.md'].slug;
  // Also handle floating_menu_javascript.md → webview/javascript
  map['floating_menu_javascript.md'] = FILE_MAP['10_2_floating_menu_javascript.md'].slug;
  map['floating_menu_javascript'] = FILE_MAP['10_2_floating_menu_javascript.md'].slug;
  // Alias: snap_areas.md → 104_snap_areas.md
  map['snap_areas.md'] = FILE_MAP['104_snap_areas.md'].slug;
  map['snap_areas'] = FILE_MAP['104_snap_areas.md'].slug;
  // Alias: 803_normal_mice_problems.md → normal_mice_problems.md
  map['803_normal_mice_problems.md'] = FILE_MAP['normal_mice_problems.md'].slug;
  map['803_normal_mice_problems'] = FILE_MAP['normal_mice_problems.md'].slug;
  return map;
}

const REVERSE_MAP = buildReverseLookup();

// ─── TRANSFORMATION PIPELINE ─────────────────────────────────────────

/** Step 1: Protect code blocks from HTML→JSX conversion */
function protectCodeBlocks(content) {
  const blocks = [];
  // Match fenced code blocks (``` or ~~~)
  const result = content.replace(/^([ \t]*(`{3,}|~{3,}).*)\n([\s\S]*?)\n([ \t]*\2)$/gm, (match) => {
    const placeholder = `__CODE_BLOCK_${blocks.length}__`;
    blocks.push(match);
    return placeholder;
  });
  return { content: result, blocks };
}

/** Step 1b: Also protect inline code */
function protectInlineCode(content) {
  const inlines = [];
  const result = content.replace(/`[^`]+`/g, (match) => {
    const placeholder = `__INLINE_CODE_${inlines.length}__`;
    inlines.push(match);
    return placeholder;
  });
  return { content: result, inlines };
}

/** Step 7: Restore code blocks */
function restoreCodeBlocks(content, blocks) {
  for (let i = 0; i < blocks.length; i++) {
    content = content.replace(`__CODE_BLOCK_${i}__`, blocks[i]);
  }
  return content;
}

function restoreInlineCode(content, inlines) {
  for (let i = 0; i < inlines.length; i++) {
    content = content.replace(`__INLINE_CODE_${i}__`, inlines[i]);
  }
  return content;
}

/** Step 2: Add frontmatter */
function addFrontmatter(content, meta) {
  const slug = meta.slug;
  const lines = [
    '---',
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    `sidebar_position: ${meta.position}`,
    `slug: "${slug}"`,
    '---',
    '',
  ];
  return lines.join('\n') + content;
}

/** Step 3: Convert HTML style attributes to JSX */
function convertStyleToJSX(styleStr) {
  const props = {};
  // Parse CSS string like "width:80%; max-width:800px; margin-bottom:20px"
  const parts = styleStr.split(';').filter(s => s.trim());
  for (const part of parts) {
    const colonIdx = part.indexOf(':');
    if (colonIdx === -1) continue;
    const key = part.slice(0, colonIdx).trim();
    const val = part.slice(colonIdx + 1).trim();
    // Convert kebab-case to camelCase
    const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    props[camelKey] = val;
  }
  // Build JSX style object string
  const entries = Object.entries(props)
    .map(([k, v]) => `${k}: '${v}'`)
    .join(', ');
  return `{{${entries}}}`;
}

function convertHTMLToJSX(content) {
  // Convert style="..." to style={{...}} (but not inside code blocks, those are protected)
  content = content.replace(/style="([^"]+)"/g, (match, css) => {
    return `style=${convertStyleToJSX(css)}`;
  });

  // Convert frameborder="0" to frameBorder="0"
  content = content.replace(/frameborder="([^"]*)"/gi, 'frameBorder="$1"');

  // Convert allowfullscreen (boolean attribute) to allowFullScreen
  content = content.replace(/\ballowfullscreen\b(?!=)/gi, 'allowFullScreen');

  // Convert autoplay="" or bare autoplay to autoPlay
  content = content.replace(/\bautoplay="[^"]*"/gi, 'autoPlay');
  content = content.replace(/\bautoplay\b(?!=)/gi, 'autoPlay');

  // Self-close void elements: <img ...> → <img ... />
  // Match <img that doesn't already end with />
  content = content.replace(/<img\b([^>]*?)(?<!\/)>/gi, (match, attrs) => {
    return `<img${attrs} />`;
  });

  // Self-close <source ...> → <source ... />
  content = content.replace(/<source\b([^>]*?)(?<!\/)>/gi, (match, attrs) => {
    return `<source${attrs} />`;
  });

  // Self-close <br> → <br />  and <br/> → <br />
  content = content.replace(/<br\s*\/?>/gi, '<br />');

  // Convert controls="" to controls
  content = content.replace(/controls=""/g, 'controls');

  // Convert muted="" to muted
  content = content.replace(/muted=""/g, 'muted');

  // Convert loop="" to loop
  content = content.replace(/loop=""/g, 'loop');

  return content;
}

/** Step 4: Convert Vimeo embeds to component calls */
function convertVimeoEmbeds(content) {
  let needsImport = false;

  // Pattern 1: <div style="padding:..."><iframe src="...vimeo..."></iframe></div><script...></script>
  const vimeoPattern = /<div\s+style="[^"]*">\s*<iframe\s+src="https:\/\/player\.vimeo\.com\/video\/(\d+)[^"]*"[^>]*><\/iframe>\s*<\/div>\s*<script[^>]*>.*?<\/script>/gi;
  content = content.replace(vimeoPattern, (match, videoId) => {
    needsImport = true;
    return `<VimeoEmbed videoId="${videoId}" />`;
  });

  // Pattern 1b: Same but with JSX-converted styles (in case style conversion ran first)
  const vimeoPatternJSX = /<div\s+style=\{\{[^}]*\}\}>\s*<iframe\s+src="https:\/\/player\.vimeo\.com\/video\/(\d+)[^"]*"[^>]*><\/iframe>\s*<\/div>\s*<script[^>]*>.*?<\/script>/gi;
  content = content.replace(vimeoPatternJSX, (match, videoId) => {
    needsImport = true;
    return `<VimeoEmbed videoId="${videoId}" />`;
  });

  // Pattern 2: Standalone <iframe src="...vimeo..."> (like in 1300_stream_deck.md)
  const standaloneVimeo = /<iframe\s+src="https:\/\/player\.vimeo\.com\/video\/(\d+)[^"]*"[^>]*(?:><\/iframe>|\/>)/gi;
  content = content.replace(standaloneVimeo, (match, videoId) => {
    needsImport = true;
    return `<VimeoEmbed videoId="${videoId}" />`;
  });

  if (needsImport) {
    // Add import after frontmatter (after the closing ---)
    const fmEnd = content.indexOf('---', content.indexOf('---') + 3);
    if (fmEnd !== -1) {
      const insertPos = fmEnd + 3;
      const importLine = "\nimport VimeoEmbed from '@site/src/components/VimeoEmbed';\n";
      content = content.slice(0, insertPos) + importLine + content.slice(insertPos);
    }
  }

  // Remove any leftover vimeo player.js script tags
  content = content.replace(/<script\s+src="https:\/\/player\.vimeo\.com\/api\/player\.js"><\/script>/gi, '');

  return content;
}

/** Step 5: Rewrite media paths */
function rewriteMediaPaths(content) {
  // media/foo.png → /media/foo.png (in markdown image syntax)
  content = content.replace(/\]\(media\//g, '](/media/');
  // src="media/ → src="/media/
  content = content.replace(/src="media\//g, 'src="/media/');
  // href="media/ → href="/media/
  content = content.replace(/href="media\//g, 'href="/media/');
  return content;
}

/** Step 6: Rewrite inter-doc links */
function rewriteLinks(content) {
  // Match markdown links: [text](target)
  content = content.replace(/\[([^\]]*)\]\(([^)#][^)]*?)\)/g, (match, text, target) => {
    // Skip external URLs, anchors, media paths
    if (target.startsWith('http') || target.startsWith('/media') || target.startsWith('mailto:')
        || target.startsWith('#')) {
      return match;
    }

    // Handle empty links
    if (!target.trim()) {
      return `[${text}](${text})`;
    }

    // Separate anchor from path
    let anchor = '';
    let filePath = target;
    const hashIdx = target.indexOf('#');
    if (hashIdx !== -1) {
      anchor = target.slice(hashIdx);
      filePath = target.slice(0, hashIdx);
    }

    // Skip if it's just an anchor
    if (!filePath) {
      return match;
    }

    // Look up in reverse map
    const slug = REVERSE_MAP[filePath] || REVERSE_MAP[filePath.replace(/^\.\//, '')];
    if (slug) {
      return `[${text}](${slug}${anchor})`;
    }

    // Try stripping docs/ prefix variations
    const stripped = filePath.replace(/^\.?\/?docs\//, '');
    const slug2 = REVERSE_MAP[stripped];
    if (slug2) {
      return `[${text}](${slug2}${anchor})`;
    }

    // If it ends with .md but wasn't found, warn but leave it
    if (filePath.endsWith('.md')) {
      console.warn(`  ⚠ Unresolved link: [${text}](${target})`);
    }

    return match;
  });

  return content;
}

/** Full transformation pipeline for a single file */
function transformFile(srcFile, content, meta) {
  // Step 1: Protect code blocks
  const { content: withoutCode, blocks } = protectCodeBlocks(content);
  const { content: withoutInline, inlines } = protectInlineCode(withoutCode);

  let result = withoutInline;

  // Step 2: Add frontmatter
  result = addFrontmatter(result, meta);

  // Step 3: Convert HTML to JSX
  result = convertHTMLToJSX(result);

  // Step 4: Convert Vimeo embeds (before restoring code blocks)
  result = convertVimeoEmbeds(result);

  // Step 5: Rewrite media paths
  result = rewriteMediaPaths(result);

  // Step 6: Rewrite inter-doc links
  result = rewriteLinks(result);

  // Step 7: Restore code blocks and inline code
  result = restoreInlineCode(result, inlines);
  result = restoreCodeBlocks(result, blocks);

  return result;
}

// ─── OUTPUT GENERATION ───────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeCategoryJson(dir, label, position, hasIndex) {
  const catJson = {
    label,
    position,
    collapsed: true,
  };
  if (hasIndex) {
    catJson.link = { type: 'generated-index' };
  }
  fs.writeFileSync(
    path.join(dir, '_category_.json'),
    JSON.stringify(catJson, null, 2) + '\n'
  );
}

function generateOutput() {
  console.log('🔄 Starting migration...\n');

  // Clean output dirs
  if (fs.existsSync(DOCS_OUT)) fs.rmSync(DOCS_OUT, { recursive: true });
  if (fs.existsSync(STATIC_OUT)) fs.rmSync(STATIC_OUT, { recursive: true });
  ensureDir(DOCS_OUT);
  ensureDir(STATIC_OUT);

  let processed = 0;
  let errors = 0;

  // Process each file
  for (const [srcFile, meta] of Object.entries(FILE_MAP)) {
    const srcPath = srcFile === 'README.md'
      ? path.join(__dirname, 'README.md')
      : path.join(DOCS_SRC, srcFile);

    if (!fs.existsSync(srcPath)) {
      console.error(`❌ Source file not found: ${srcPath}`);
      errors++;
      continue;
    }

    const content = fs.readFileSync(srcPath, 'utf-8');
    const transformed = transformFile(srcFile, content, meta);

    // Determine output filename
    const outFilename = meta.filename || meta.slug.split('/').pop();
    const outDir = meta.dir ? path.join(DOCS_OUT, meta.dir) : DOCS_OUT;
    ensureDir(outDir);

    const outPath = path.join(outDir, `${outFilename}.mdx`);
    fs.writeFileSync(outPath, transformed);
    processed++;
    console.log(`  ✅ ${srcFile} → ${path.relative(__dirname, outPath)}`);
  }

  // Generate _category_.json files
  console.log('\n📁 Generating category metadata...');
  const categoriesWithIndex = new Set();
  for (const meta of Object.values(FILE_MAP)) {
    if (meta.isIndex && meta.dir) categoriesWithIndex.add(meta.dir);
  }

  for (const [dirName, catMeta] of Object.entries(CATEGORIES)) {
    const catDir = path.join(DOCS_OUT, dirName);
    ensureDir(catDir);
    writeCategoryJson(catDir, catMeta.label, catMeta.position, categoriesWithIndex.has(dirName));
    console.log(`  📂 ${dirName}/_category_.json`);
  }

  // Copy media
  console.log('\n📦 Copying media assets...');
  const mediaSrc = path.join(DOCS_SRC, 'media');
  const mediaDst = path.join(STATIC_OUT, 'media');
  if (fs.existsSync(mediaSrc)) {
    copyDirRecursive(mediaSrc, mediaDst);
    const mediaCount = countFiles(mediaDst);
    console.log(`  📸 Copied ${mediaCount} media files`);
  }

  // Copy actionlist.json
  const actionlistSrc = path.join(__dirname, 'actionlist.json');
  if (fs.existsSync(actionlistSrc)) {
    fs.copyFileSync(actionlistSrc, path.join(STATIC_OUT, 'actionlist.json'));
    console.log('  📋 Copied actionlist.json');
  }

  console.log(`\n✨ Migration complete: ${processed} files processed, ${errors} errors`);

  // Validation pass
  runValidation();
}

function copyDirRecursive(src, dst) {
  ensureDir(dst);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

// ─── VALIDATION ──────────────────────────────────────────────────────

function runValidation() {
  console.log('\n🔍 Running validation...');
  let warnings = 0;

  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.mdx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');

        // Protect code blocks before validating
        const { content: noCode } = protectCodeBlocks(content);
        const { content: noInline } = protectInlineCode(noCode);

        // Check for unconverted style="..."
        const styleMatches = noInline.match(/style="[^"]+"/g);
        if (styleMatches) {
          console.warn(`  ⚠ ${path.relative(DOCS_OUT, fullPath)}: Unconverted style attributes (${styleMatches.length})`);
          warnings++;
        }

        // Check for unconverted frameborder (lowercase only, frameBorder is valid JSX)
        if (/frameborder=/i.test(noInline) && !/frameBorder=/.test(noInline)) {
          console.warn(`  ⚠ ${path.relative(DOCS_OUT, fullPath)}: Unconverted frameborder`);
          warnings++;
        }

        // Check for unconverted allowfullscreen (lowercase)
        if (/\ballowfullscreen\b/g.test(noInline) && !/allowFullScreen/.test(noInline)) {
          console.warn(`  ⚠ ${path.relative(DOCS_OUT, fullPath)}: Unconverted allowfullscreen`);
          warnings++;
        }

        // Check for old .md file links
        const oldLinks = noInline.match(/\]\([^)]*?(?:docs\/)?[\w]+\.md[^)]*?\)/g);
        if (oldLinks) {
          console.warn(`  ⚠ ${path.relative(DOCS_OUT, fullPath)}: Old .md links remaining: ${oldLinks.join(', ')}`);
          warnings++;
        }
      }
    }
  }

  scanDir(DOCS_OUT);

  if (warnings === 0) {
    console.log('  ✅ No validation warnings!');
  } else {
    console.log(`  ⚠ ${warnings} validation warning(s)`);
  }
}

// ─── RUN ─────────────────────────────────────────────────────────────
generateOutput();
