# Scripting BTT

BetterTouchTool supports a generic scripting interface (see below), which can be accessed via different means, depending on your use case.


* [Via JavaScript (Recommended as of BTT 3.333)](1106_java_script.md)
* [Via Apple Script](1102_apple_script.md)
* [Via the custom btt:// URL Scheme](1103_custom_url_scheme.md)
* [Via an integrated webserver](1104_webserver.md)


**Floating WebView/ HTML Menu**: Additionally if you use BetterTouchTool's Floating Web View, you can easily access the scripting interface right from the HTML/JavaScript: [Trigger from Floating Web View](floating_menu_javascript.md)


**These are the available scripting interfaces**:
(please go to the appropriate scripting sub-section to see examples)
* trigger_named
* update_touch_bar_widget
* update_stream_deck_widget
* trigger_action
* execute_assigned_actions_for_trigger
* refresh_widget
* get_trigger
* get_triggers
* update_trigger (to create or if exists update a trigger)
* add_new_trigger 
* delete_trigger
* delete_triggers
* trigger_named
* trigger_named_async_without_response
* cancel_delayed_named_trigger_execution
* get_dock_badge_for
* get_active_touch_bar_group
* is_true_tone_enabled
* get_location
* set_persistent_string_variable
* set_string_variable
* set_persistent_number_variable
* set_number_variable
* get_number_variable
* get_string_variable
* export_preset
* get_menu_item_details
* paste_text
* reveal_element_in_ui
* display_notification

Floating Menus:
* update_menu_item
* get_menu_item_value
* set_menu_item_value
* webview_menu_item_load_html_url_js

**Note: There are some built-in variables, which can also be quite helpful**:

[Built-In Scripting Variables](1105_variables.md)