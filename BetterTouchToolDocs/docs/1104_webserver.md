
- [Integrated Webserver](#integrated-webserver)
- [Basic settings](#basic-settings)
  - [HTTP Endpoints](#http-endpoints)
    - [Badge Management](#badge-management)
    - [Touch Bar](#touch-bar)
    - [System Information](#system-information)
    - [Variable Management](#variable-management)
    - [UI Elements](#ui-elements)
    - [Menu Items](#menu-items)
    - [Text Operations](#text-operations)
    - [Widget Management](#widget-management)
    - [Trigger Management](#trigger-management)
    - [Shortcuts](#shortcuts)
    - [Clipboard Operations](#clipboard-operations)
    - [Preset Management](#preset-management)
  - [WebSocket Endpoints](#websocket-endpoints)
  - [Security Notes](#security-notes)
- [Some Examples](#some-examples)
    - [**trigger\_named**](#triggernamed)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like)
    - [**update\_touch\_bar\_widget**](#updatetouchbarwidget)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-1)
    - [**trigger\_action**](#triggeraction)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-2)
    - [**execute\_assigned\_actions\_for\_trigger**](#executeassignedactionsfortrigger)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-3)
    - [**refresh\_widget**](#refreshwidget)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-4)
    - [**update\_trigger**](#updatetrigger)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-5)
    - [**get\_trigger**](#gettrigger)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-6)
    - [**get\_triggers**](#gettriggers)
      - [Example Terminal Command (but you can call the URL however you like). This would get all named triggers configured in BTT.](#example-terminal-command-but-you-can-call-the-url-however-you-like-this-would-get-all-named-triggers-configured-in-btt)
    - [**add\_new\_trigger**](#addnewtrigger)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-7)
    - [**set\_persistent\_string\_variable**](#setpersistentstringvariable)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-8)
    - [**set\_string\_variable**](#setstringvariable)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-9)
    - [**set\_persistent\_number\_variable**](#setpersistentnumbervariable)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-10)
    - [**set\_number\_variable**](#setnumbervariable)
      - [Example Terminal Command (but you can call the URL however you like)](#example-terminal-command-but-you-can-call-the-url-however-you-like-11)


# Integrated Webserver

BetterTouchTool has a basic integrated Webserver. It is **disabled** by default and can be activated in the advanced preferences.

![webserver](media/new/webserver.jpg)

The integrated webserver can be used for a few very interesting usecases:

* To easily trigger BetterTouchTool actions from websites (e.g. when building a custom "Dashboard" thingy)
* Controlling your computer from tablet's or smartphone's via custom dashboards. This allows you to use BetterTouchTool actions from devices that don't support BTT Remote (Android, Windows Phone etc.)


# Basic settings
The webserver settings are all located in the advanced preferences. There are not many settings.

* You can choose a port (on first start it will automatically assign some random port if you don't enter any) 
* You can set a shared secret (which you should if you make it available in your network). This shared secret must then be included in all urls to the server (e.g. https://127.0.0.1:12345/?shared_secret=v3rY_$ecre7)
* You can choose on which interface the server should listen. The default is 127.0.0.1 (which means only applications on your computer can access it). If you want to make it available in your network, you need to enter your computers local IP (can be found in System Preferences => Network.)
* You can enable HTTPS. This will use the BetterTouchToolRemote_New certificate in your keychain. You need to make this a trusted certificate, otherwise your browsers will complain (on macOS you can do it by going to your keychain, right-clicking it => get info => trust => always trust)

If you want the server to serve files, you can put them in this directory (doesn't exist by default):
~/Library/Application Support/BetterTouchTool/BTTWebServer/


## HTTP Endpoints

### Badge Management
- `/get_dock_badge_for/` - Gets dock badge information

### Touch Bar
- `/get_active_touch_bar_group/` - Gets the currently active touch bar group
- `/update_touch_bar_widget/` - Updates touch bar widget

### System Information
- `/is_true_tone_enabled/` - Checks if True Tone is enabled
- `/get_location/` - Gets location information
- `/get_weather/` - Gets weather information

### Variable Management
- `/set_persistent_string_variable/` - Sets a persistent string variable
- `/set_string_variable/` - Sets a string variable
- `/set_persistent_number_variable/` - Sets a persistent number variable
- `/set_number_variable/` - Sets a number variable
- `/get_number_variable/` - Gets a number variable value
- `/get_string_variable/` - Gets a string variable value

### UI Elements
- `/reveal_element_in_ui/` - Reveals an element in the UI

### Menu Items
- `/set_menu_item_value/` - Sets menu item value
- `/update_menu_item/` - Updates menu item
- `/update_floating_menu_item/` - Updates floating menu item
- `/get_menu_item_value/` - Gets menu item value
- `/get_floating_menu_item_value/` - Gets floating menu item value
- `/get_menu_item_details/` - Gets detailed information about a menu item
- `/webview_menu_item_load_html_url_js/` - Loads HTML/URL/JS in webview menu item

### Text Operations
- `/paste_text/` - Pastes text

### Widget Management
- `/refresh_widget/` - Refreshes a widget
- `/update_menubar_item/` - Updates menubar item
- `/update_stream_deck_widget/` - Updates Stream Deck widget

### Trigger Management
- `/update_trigger/` - Updates a trigger
- `/execute_assigned_actions_for_trigger/` - Executes actions assigned to a trigger
- `/add_new_trigger/` - Adds a new trigger
- `/trigger_action/` - Triggers an action
- `/trigger_named/` - Triggers a named trigger
- `/trigger_named_async_without_response/` - Triggers named trigger asynchronously without response
- `/cancel_delayed_named_trigger_execution/` - Cancels delayed named trigger execution
- `/delete_trigger/` - Deletes a trigger
- `/get_trigger/` - Gets trigger information
- `/get_triggers/` - Gets multiple triggers

### Shortcuts
- `/run_shortcut/` - Runs a shortcut

### Clipboard Operations
- `/get_clipboard_content/` - Gets clipboard content
- `/get_selection/` - Gets current selection
- `/set_clipboard_content/` - Sets clipboard content
- `/set_clipboard_contents/` - Sets clipboard contents (duplicate endpoint)

### Preset Management
- `/export_preset/` - Exports a preset
- `/import_preset/` - Imports a preset
- `/get_preset_details/` - Gets preset details

## WebSocket Endpoints

- `/service` - WebSocket endpoint for BTTWebSocket service

## Security Notes

- All endpoints require authentication via shared secret stored in keychain
- The shared secret must be included in the path
- Requests without proper authentication return HTTP 403 error
- Server can be configured to use SSL/TLS encryption


# Some Examples

### **trigger_named**
This method will trigger the specified named trigger (which can be configured in the "Other" tab in BetterTouchTool.)

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/trigger_named/?trigger_name=TriggerName"
```

### **update_touch_bar_widget**
This method will update the contents of a Touch  Bar Script Widget (identified by its uuid). You can provide a new text to show, a new icon and a new background color.

For the icon you can either provide it directly using the icon_data parameter (must be base64 encoded) or you can provide a file path that points to the new icon (via the icon_path parameter).

You can get the uuid by right-clicking any script widget in BTT.

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/update_touch_bar_widget/?uuid=CC46E199-B07D-4BF7-AC36-48AAE558540B&text=updatedText&icon_path=/Users/andi/Desktop/test.png&background_color=200,200,100,255"

```

---


### **trigger_action**
This method will trigger any of BetterTouchTool's predefined actions (or any combination of them).

You need to provide a JSON description of the action you want to trigger. The easiest way to get such a JSON description is to right-click the trigger you have configured in BetterTouchTool and choose "Copy JSON". This will copy the complete JSON (including the configuration for the trigger itself), but this action will ignore anything that's not needed. (or you can delete the not needed parts)
#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/trigger_action/?json={ \"BTTPredefinedActionType\" : 153, \"BTTPredefinedActionName\" : \"Move Mouse To Position\", \"BTTMoveMouseToPosition\" : \"{100, 10}\", \"BTTMoveMouseRelative\" : \"6\" }"
```
---


### **execute_assigned_actions_for_trigger**
This method execute all the assigned actions for a given trigger (i.e. gesture, shortcut, drawing etc.) identified by its uuid.

You can get the uuid by right-clicking any configured trigger in BetterTouchTool.

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/execute_assigned_actions_for_trigger/?uuid=C40D3AE2-2F4E-49B1-A00C-F7E4C3632F07" 

```


---


### **refresh_widget**
This method will execute all scripts assigned to a script widget and update its contents accordingly.

The widget is identified by its uuid, which you can get by right-clicking the widget in BetterTouchTool.

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/refresh_widget/?uuid=C40D3AE2-2F4E-49B1-A00C-F7E4C3632F07" 

```

---


### **update_trigger**
This method will update the configuration of any trigger you have configured in BTT (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide the uuid of the trigger you want to update (get by right-clicking it in BTT) and a JSON object defining the updates. To know how the JSON object should look like, right-click the trigger in BTT and choose "Copy JSON".

**Optional Parameter**: trigger_parent_uuid (if you want to add the trigger to a group)


#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/update_trigger/?uuid=0E2F7963-E64C-403A-8591-C3725D4D9ADC&json={\"BTTTouchBarButtonName\" : \"New Name2\",  \"BTTTriggerConfig\" : {\"BTTTouchBarItemIconHeight\" : 30}}"
```

---

### **get_trigger**
This method will return the JSON description for given trigger with the specified UUID (i.e. gestures, shortcuts, touchbar items etc.).



#### Example Terminal Command (but you can call the URL however you like)
```Bash
/usr/bin/curl "http://127.0.0.1:12345/get_trigger/?uuid=CC46E199-B07D-4BF7-AC36-48AAE558540B"
```

---

### **get_triggers**
This allows you to retrieve the JSON description of multiple triggers in BTT (e.g. Touch Bar item, Gesture, Keyboard Shortcut etc.) based on a few properties.

You can get the properties of a specific trigger by selecting it in BTT and copy pasting it to some text editor.

The get_triggers() function supports these parameters (all optional):

* trigger_type (e.g. BTTTriggerTypeMagicMouse)
* trigger_id (e.g. 643 for named triggers)
* trigger_parent_uuid (if you want to get the items of a folder)
* trigger_uuid (to get a specific trigger)
* trigger_app_bundle_identifier (to get triggers assigned to a specific app)



#### Example Terminal Command (but you can call the URL however you like). This would get all named triggers configured in BTT.
```Bash
/usr/bin/curl "http://127.0.0.1:12345/get_triggers/?trigger_id=643"
```

---



### **add_new_trigger**
This method will add a new trigger to BTT (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide a JSON object defining the new trigger. To know how the JSON object should look like, right-click any existing trigger in BTT and choose "Copy JSON".


#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/add_new_trigger/?json={ \"BTTTriggerClass\" : \"BTTTriggerTypeKeyboardShortcut\", \"BTTPredefinedActionType\" : 5, \"BTTPredefinedActionName\" : \"Mission Control\", \"BTTAdditionalConfiguration\" : \"1179658\", \"BTTTriggerOnDown\" : 1, \"BTTEnabled\" : 1, \"BTTShortcutKeyCode\" : 2, \"BTTShortcutModifierKeys\" : 1179648, \"BTTOrder\" : 3 }"
```



---

### **set_persistent_string_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/set_persistent_string_variable/?variableName=test&to=12345"
```


---

### **set_string_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/set_string_variable/?variableName=test&to=12345"
```


---



### **set_persistent_number_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.


#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/set_persistent_number_variable/?variableName=test&to=12345"
```


---

### **set_number_variable**
This allows you to set a variable to a given string for the runtime of BTT.


#### Example Terminal Command (but you can call the URL however you like)
```Bash
open "http://127.0.0.1:12345/set_number_variable/?variableName=test&to=12345"
```


---







