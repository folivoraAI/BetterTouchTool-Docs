
# Scripting BetterTouchTool using Apple Script

BetterTouchTool has a small but powerful Apple Script interface which will be described here.

The most current documentation for all supported Apple Script calls can directly be accessed via Apple's Script Editor app on macOS. Go to File => Open Dictionary => BetterTouchTool to access it there.

- [Scripting BetterTouchTool using Apple Script](#scripting-bettertouchtool-using-apple-script)
  - [Security](#security)
  - [Available Scripting Interfaces](#available-scripting-interfaces)
    - [**trigger\_named**](#triggernamed)
      - [Standard Apple Script Example:](#standard-apple-script-example)
      - [Java Script for Automation Example:](#java-script-for-automation-example)
    - [**trigger\_named\_async\_without\_response**](#triggernamedasyncwithoutresponse)
      - [Standard Apple Script Example:](#standard-apple-script-example-1)
      - [Java Script for Automation Example:](#java-script-for-automation-example-1)
    - [**cancel\_delayed\_named\_trigger\_execution**](#canceldelayednamedtriggerexecution)
      - [Standard Apple Script Example:](#standard-apple-script-example-2)
      - [Java Script for Automation Example:](#java-script-for-automation-example-2)
    - [**update\_touch\_bar\_widget**](#updatetouchbarwidget)
      - [Standard Apple Script Example:](#standard-apple-script-example-3)
      - [Java Script for Automation Example:](#java-script-for-automation-example-3)
    - [**update\_stream\_deck\_widget**](#updatestreamdeckwidget)
      - [Standard Apple Script Example:](#standard-apple-script-example-4)
      - [Java Script for Automation Example:](#java-script-for-automation-example-4)
    - [**update\_menubar\_item**](#updatemenubaritem)
      - [Example:](#example)
    - [**trigger\_action**](#triggeraction)
      - [Standard Apple Script Example:](#standard-apple-script-example-5)
      - [Java Script for Automation Example:](#java-script-for-automation-example-5)
    - [**execute\_assigned\_actions\_for\_trigger**](#executeassignedactionsfortrigger)
      - [Standard Apple Script Example:](#standard-apple-script-example-6)
      - [Java Script for Automation Example:](#java-script-for-automation-example-6)
    - [**refresh\_widget**](#refreshwidget)
      - [Standard Apple Script Example:](#standard-apple-script-example-7)
      - [Java Script for Automation Example:](#java-script-for-automation-example-7)
    - [**get\_trigger**](#gettrigger)
      - [Standard Apple Script Example:](#standard-apple-script-example-8)
      - [Java Script for Automation Example:](#java-script-for-automation-example-8)
    - [**get\_triggers**](#gettriggers)
      - [Java Script for Automation Example:](#java-script-for-automation-example-9)
    - [**update\_trigger**](#updatetrigger)
      - [Standard Apple Script Example:](#standard-apple-script-example-9)
      - [Java Script for Automation Example:](#java-script-for-automation-example-10)
    - [**add\_new\_trigger**](#addnewtrigger)
      - [Standard Apple Script Example:](#standard-apple-script-example-10)
      - [Java Script for Automation Example:](#java-script-for-automation-example-11)
    - [**delete\_trigger**](#deletetrigger)
      - [Standard Apple Script Example:](#standard-apple-script-example-11)
      - [Java Script for Automation Example:](#java-script-for-automation-example-12)
    - [**delete\_triggers**](#deletetriggers)
      - [Java Script for Automation Example:](#java-script-for-automation-example-13)
    - [**set\_persistent\_string\_variable**](#setpersistentstringvariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-12)
      - [Java Script for Automation Example:](#java-script-for-automation-example-14)
    - [**set\_string\_variable**](#setstringvariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-13)
      - [Java Script for Automation Example:](#java-script-for-automation-example-15)
    - [**set\_persistent\_number\_variable**](#setpersistentnumbervariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-14)
      - [Java Script for Automation Example:](#java-script-for-automation-example-16)
    - [**set\_number\_variable**](#setnumbervariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-15)
      - [Java Script for Automation Example:](#java-script-for-automation-example-17)
    - [**get\_number\_variable**](#getnumbervariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-16)
      - [Java Script for Automation Example:](#java-script-for-automation-example-18)
    - [**get\_string\_variable**](#getstringvariable)
      - [Standard Apple Script Example:](#standard-apple-script-example-17)
      - [Java Script for Automation Example:](#java-script-for-automation-example-19)
    - [**get\_dock\_badge\_for**](#getdockbadgefor)
      - [Standard Apple Script Example:](#standard-apple-script-example-18)
      - [Java Script for Automation Example:](#java-script-for-automation-example-20)
    - [**export\_preset**](#exportpreset)
      - [Standard Apple Script Example:](#standard-apple-script-example-19)
    - [**import\_preset**](#importpreset)
      - [Standard Apple Script Example:](#standard-apple-script-example-20)
    - [**get\_preset\_details**](#getpresetdetails)
    - [**get\_menu\_item\_details**](#getmenuitemdetails)
      - [Standard Apple Script Example:](#standard-apple-script-example-21)
    - [**reveal\_element\_in\_ui**](#revealelementinui)
      - [Standard Apple Script Example:](#standard-apple-script-example-22)
    - [**paste\_text**](#pastetext)
      - [Standard Apple Script Example:](#standard-apple-script-example-23)
    - [**get\_clipboard\_content**](#getclipboardcontent)
      - [Example](#example-1)
    - [**get\_selection**](#getselection)
      - [Example](#example-2)
    - [**set\_clipboard\_content**](#setclipboardcontent)
      - [Standard Apple Script Example:](#standard-apple-script-example-24)
  - [Floating Menus](#floating-menus)
    - [**update\_menu\_item**](#updatemenuitem)
    - [**get\_menu\_item\_value**](#getmenuitemvalue)
    - [**set\_menu\_item\_value**](#setmenuitemvalue)
    - [**webview\_menu\_item\_load\_html\_url\_js**](#webviewmenuitemloadhtmlurljs)



**Note: There are some built-in variables, which can also be quite helpful**:

[Built-In Scripting Variables](1105_variables.md)


## Security
In general every application that is allowed to execute Apple Script could trigger these scripting functions. If you do not want this, you can define a shared secret which then must be included in all calls as "shared_secret" parameter.

The shared secret can be defined in the advanced preferences
![shared_secret](media/new/scripting_secret.jpg)

## Available Scripting Interfaces

### **trigger_named**
This method will trigger the specified named trigger (which can be configured in the "Other" tab in BetterTouchTool.)

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

trigger_named "TriggerName" 

end tell
```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.trigger_named("TriggerName");
```
---


### **trigger_named_async_without_response**
This method will trigger the specified named trigger (which can be configured in the "Other" tab in BetterTouchTool.).
In contrast to the trigger_named it does not wait for a result - **this should always be used if you do not need a response**.
cancel_delayed_named_trigger_execution
Optional parameter: 
**delay** This lets you set a delay before the named trigger is executed (in seconds). While the trigger has not been executed you can cancel the execution by calling the  **cancel_delayed_named_trigger_execution** function

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

trigger_named_async_without_response "TriggerName" delay 0.2

end tell
```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.trigger_named_async_without_response("TriggerName", {delay: 0.2});
```

---
---


### **cancel_delayed_named_trigger_execution**
This method will cancel the execution of a delayed named trigger (see previous function)

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

trigger_named_async_without_response "TriggerName" delay 0.2

end tell
```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.trigger_named_async_without_response("TriggerName", {delay: 0.2});
```
---




### **update_touch_bar_widget**
This method will update the contents of a Touch  Bar Script Widget (identified by its uuid). You can provide a new text to show, a new icon and a new background color.

For the icon you can either provide it directly using the icon_data parameter (must be base64 encoded) or you can provide a file path (via the icon_path parameter) that points to the new icon.

You can get the uuid by right-clicking any script widget in BTT.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

update_touch_bar_widget "9990CE09-9820-4D67-9C52-8BABAB263056" text "newButtonText" icon_path "~/Desktop/005-ShoppingBasket@2x.png" background_color "255,100,100,255"

end tell
```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.update_touch_bar_widget("9990CE09-9820-4D67-9C52-8BABAB263056", 
{
	text: "hi there!",
	icon_path: "/Users/andi/Desktop/test.png",
	background_color: "200,100,100,255"	
});
```
---




### **update_stream_deck_widget**
This method will update the contents of a Stream Deck Widget (identified by its uuid). You can provide a new text to show, and update any of it's configuration properties by providing an (escaped) JSON string.

You can get the uuid by right-clicking any widget in BTT.
To get a list of the configuration properties copy an existing Stream Deck trigger to a text editor and have a look at the BTTTriggerConfig part in the JSON.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

update_stream_deck_widget "9990CE09-9820-4D67-9C52-8BABAB263056" text "newButtonText" json "{\"BTTStreamDeckBackgroundColor\": \"255,85,100,255\"}"

end tell
```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');
var updateDefinition = {
    "text": "newButtonText"
	"BTTStreamDeckBackgroundColor" : "255,85,100,255"
    }
BetterTouchTool.update_stream_deck_widget("2F34005D-4537-464D-94E9-A7F42DA39DF1", {json: JSON.stringify(updateDefinition)});

```
---


### **update_menubar_item**
This method will temporarily update the contents of a Menubar Status Item configured in the "Automations, Named & Other Triggers" section(identified by its uuid). You can provide a new text to show, a new icon and a new background color.

For the icon you can either provide it directly using the icon_data parameter (must be base64 encoded) or you can provide a file path (via the icon_path parameter) that points to the new icon.

You can get the uuid by right-clicking any script widget in BTT.

#### Example:

```AppleScript
tell application "BetterTouchTool" to update_menubar_item "E2F16C7E-C2E4-4898-BB8C-21D3C653B843" text "new text"
```

Supported paramerters:
**shared_secret** (text) : You can specify a shared secret which must be contained in all Apple Script calls in the advanced BTT preferences.

**text** (text) : The text you want to show in the menubar item

**hidden** (boolean) : Define whether the item should be hidden

**icon_path** (text) : A file path to an icon that should be 
loaded
**icon_data** (text) : The base64 encoded icon data of the 
icon you want to show on the menubar item

**sf_symbol_name** (text) : The name of the sf symbol to load

**sf_symbol_size** (number) : The size of the sf symbol to load

**sf_symbol_weight** (number) : The weight of the sf symbol to load

**background_color** (text) : The background color the menubar item should have. Must be in this format (RGBA): 255,255,255,255

**font_color** (text) : The font and sfsymbol color the menubar item should have. Must be in this format (RGBA): 255,255,255,255

---


### **trigger_action**
This method will trigger any of BetterTouchTool's predefined actions (or any combination of them).

You need to provide a JSON description of the action you want to trigger. The easiest way to get such a JSON description is to right-click the trigger you have configured in BetterTouchTool and choose "Copy JSON". This will copy the complete JSON (including the configuration for the trigger itself), but this action will ignore anything that's not needed. (or you can delete the not needed parts)
#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

	trigger_action "{\"BTTPredefinedActionType\":100}"

end tell

```
#### Java Script for Automation Example:
Hint: don't forget to use JSON.stringify() before passing the actionDefinition object.
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');
var actionDefinition = {
  "BTTPredefinedActionType" : 153, 
  "BTTPredefinedActionName" : "Move Mouse To Position", 
  "BTTMoveMouseToPosition" : "{10, 10}", 
  "BTTMoveMouseRelative" : "6"
};


BetterTouchTool.trigger_action(JSON.stringify(actionDefinition));

```

---


### **execute_assigned_actions_for_trigger**
This method execute all the assigned actions for a given trigger (i.e. gesture, shortcut, drawing etc.) identified by its uuid.

You can get the uuid by right-clicking any configured trigger in BetterTouchTool.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	execute_assigned_actions_for_trigger "2F34005D-4537-464D-94E9-A7F42DA39DF1"
end tell

```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.execute_assigned_actions_for_trigger("2F34005D-4537-464D-94E9-A7F42DA39DF1");

```

---


### **refresh_widget**
This method will execute all scripts assigned to a script widget and update its contents accordingly.

The widget is identified by its uuid, which you can get by right-clicking the widget in BetterTouchTool.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	refresh_widget "2F34005D-4537-464D-94E9-A7F42DA39DF1"
end tell

```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.refresh_widget("2F34005D-4537-464D-94E9-A7F42DA39DF1");

```
---


### **get_trigger**
This allows you to retrieve the JSON description of any trigger in BTT (e.g. Touch Bar item, Gesture, Keyboard Shortcut etc.) based on its UUID.

You can get the UUID by right-clicking any trigger in BTT.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    return get_trigger "9D189F2C-6866-4955-9D8E-FEC96C5C7E30"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.get_trigger("9D189F2C-6866-4955-9D8E-FEC96C5C7E30");

```

---

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



#### Java Script for Automation Example:

This will load the names of all "named triggers" (trigger id 643): 

```JavaScript
let BetterTouchTool = Application('BetterTouchTool');
let allNamedTriggersJSONString = BetterTouchTool.get_triggers({trigger_id: 643});
let allTriggersJSONArray = JSON.parse(allNamedTriggersJSONString);

let allNamedTriggerNames = [];
for(let trigger of allTriggersJSONArray) {
	allNamedTriggerNames.push(trigger["BTTTriggerName"]);
}

allNamedTriggerNames

```

---

---




### **update_trigger**
This method will create or update the configuration of any specified trigger (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide the uuid of the trigger you want to update (get by right-clicking it in BTT) and a JSON object defining the updates. To know how the JSON object should look like, right-click the trigger in BTT and choose "Copy JSON".

**Optional Parameter**: trigger_parent_uuid (if you want to add the trigger to a group)

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

update_trigger "2F34005D-4537-464D-94E9-A7F42DA39DF1" json "{\"BTTTouchBarButtonName\" : \"New Name\",  \"BTTTouchBarItemIconHeight\" : 25}"

end tell


```
#### Java Script for Automation Example:
Hint: don't forget to use JSON.stringify() before passing the actionDefinition object.
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');
var updateDefinition = {
	"BTTTouchBarButtonName" : "New Name",
	"BTTTouchBarItemIconHeight" : 25
}
BetterTouchTool.update_trigger("2F34005D-4537-464D-94E9-A7F42DA39DF1", {json: JSON.stringify(updateDefinition)});

```

---


### **add_new_trigger**
This method will add a new trigger to BTT (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide a JSON object defining the new trigger. To know how the JSON object should look like, right-click any existing trigger in BTT and choose "Copy JSON".

Optional parameter: **parent_uuid**

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

add_new_trigger "{ \"BTTTriggerClass\" : \"BTTTriggerTypeKeyboardShortcut\", \"BTTPredefinedActionType\" : 5, \"BTTPredefinedActionName\" : \"Mission Control\", \"BTTAdditionalConfiguration\" : \"1179658\", \"BTTTriggerOnDown\" : 1, \"BTTEnabled\" : 1, \"BTTShortcutKeyCode\" : 2, \"BTTShortcutModifierKeys\" : 1179648, \"BTTOrder\" : 3 }" 

end tell

```
#### Java Script for Automation Example:
Hint: don't forget to use JSON.stringify() before passing the actionDefinition object.
```JavaScript

// this will add a new keyboard shortcut to BTT.
var BetterTouchTool = Application('BetterTouchTool');

var newTriggerDefinition = {
  "BTTTriggerClass" : "BTTTriggerTypeKeyboardShortcut",
  "BTTPredefinedActionType" : 5,
  "BTTPredefinedActionName" : "Mission Control",
  "BTTAdditionalConfiguration" : "1179648",
  "BTTTriggerOnDown" : 1,
  "BTTEnabled" : 1,
  "BTTShortcutKeyCode" : 2,
  "BTTShortcutModifierKeys" : 1179648,
  "BTTOrder" : 3
}

BetterTouchTool.add_new_trigger(JSON.stringify(newTriggerDefinition))

```




### **delete_trigger**
This method will delete a trigger from BetterTouchTool.
You need to provide the uuid of the trigger you want to delete (get by right-clicking it in BTT).

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

delete_trigger "2F34005D-4537-464D-94E9-A7F42DA39DF1"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.delete_trigger("2F34005D-4537-464D-94E9-A7F42DA39DF1");

```

---
---



### **delete_triggers**
This allows you to delete multiple triggers in BTT based on a few properties. If you want to "test" your query before deleting, use the get_triggers function first - it uses the exact same parameters.

You can get the properties of a specific trigger by selecting it in BTT and copy pasting it to some text editor.

The delete_triggers() function supports these parameters (all optional):
• trigger_type (e.g. BTTTriggerTypeMagicMouse)
• trigger_id (e.g. 643 for named triggers)
• trigger_parent_uuid (if you want to get the items of a folder)
• trigger_uuid (to get a specific trigger)
• trigger_app_bundle_identifier (to get triggers assigned to a specific app)



#### Java Script for Automation Example:

This will delete all "named triggers" (trigger id 643): 

```JavaScript
let BetterTouchTool = Application('BetterTouchTool');
BetterTouchTool.delete_triggers({trigger_id: 643});
```

---

---




### **set_persistent_string_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    set_persistent_string_variable "variableName" to "this is a test value"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.set_persistent_string_variable("variableName", {to: "this is a test value"});

```

---

### **set_string_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    set_string_variable "variableName" to "this is a test value"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.set_string_variable("variableName", {to: "this is a test value"});

```

---


### **set_persistent_number_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    set_persistent_number_variable "variableName" to 12345

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.set_persistent_number_variable("variableName", {to: 1345});

```

---


### **set_number_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    set_number_variable "variableName" to 12345

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.set_number_variable("variableName", {to: 1345});

```

---

### **get_number_variable**
This allows you to retrieve the contents of a number variable with the given name

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    return get_number_variable "variableName"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.get_number_variable("variableName");

```

---

### **get_string_variable**
This allows you to retrieve the contents of a string variable with the given name

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

    return get_string_variable "variableName"

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.get_string_variable("variableName");

```

---


### **get_dock_badge_for**
This method will efficiently get the current Dock badge for a specific application. Running this function multiple times will return the previously cached value until the specified update_interval has been reached. 

When an update interval is provided, BTT will internally refresh the badges for all apps every x seconds. In this case consecutive "get_dock_badge_for" function calls are basically free, as they will just return the last cached value. This is the recommended way to do it, and the update_interval should not be too small.

If you need to refresh the cache immediately for some reason, you can leave the update_interval function out. Then BTT will immediately refresh all the dock badges and return the latest value.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"

	get_dock_badge_for "Calendar" update_interval 5

end tell


```
#### Java Script for Automation Example:
```JavaScript
var BetterTouchTool = Application('BetterTouchTool');

BetterTouchTool.get_dock_badge_for("Calendar", {'update_interval': 5});

```

---

### **export_preset**
Exports a preset by name. 

includeSettings will in addition to the configured triggers add general preferences to the preset export.

link, comment and compression is optional.

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	
	export_preset "some-example-preset" outputPath "~/Documents/preset.bttpreset" comment "someComment" link "https://someLinkToShowWhenImporting" with includeSettings and compress
	
end tell
```

---


### **import_preset**
Imports a preset by path. 


#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	import_preset "/path/to/your/preset.bttpreset"
end tell
```

---

### **get_preset_details**
This allows you to query the state of a preset. Note: this returns a JSON array - which usually contains details for one preset but in some situations might contain multiple preset details.


```AppleScript
tell application "BetterTouchTool" to get_preset_details "thePresetName"


```

Example output:
```JSON
"[
  {
    \"uuid\" : \"F8367505-8409-4828-B5FA-8596932687F4\",
    \"hidden\" : 0,
    \"name\" : \"thePresetName\",
    \"activated\" : 2, 
    \"color\" : \"30.069600, 113.581080, 136.680000, 255.000000\"
  }
]"
```

activated can be 0 (disabled), 1 (enabled), or 2 (enabled & master preset)

---

### **get_menu_item_details**
Gets the details (available, enabled, checked) of a given menubar menu item. This can be helpful to perform actions conditionally if a menu item is enabled/disabled.

Parameters:
**The path to the menu bar item** E.g. "Edit;Cut" or "Window;Move & Resize; Left"


#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool" to get_menu_item_details "Edit;Cut" end tell
```
  

---

### **reveal_element_in_ui**
This will show a BTT trigger identified by it's UUID in the BetterTouchTool user interface.

Parameters:
**The UUID of the trigger** (you can get the UUID of a trigger by right-clicking it or e.g. via the "get_triggers" scripting function)


#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool" to reveal_element_in_ui "39CDAF30-98BB-4F54-B87F-273B6081149E" end tell
```
  

### **paste_text**
This pastes some text

Parameters:

**text**: The text to paste.

**insert_by_pasting**: If set to true BTT will use cmd+v to paste the text. Otherwise it will actually try to type it (only possible for standard formats)

**move_cursor_left_by_x_after_pasting**: If specified BTT will move the cursor by the given amount to the left.

**format**: Optional. The format the text will be interpreted as when pasting (e.g. if you want to paste a table, you can use set the string to ```<table>...</table>``` and specify the format NSPasteboardTypeHTML)

Default formats are (more are possible):
NSPasteboardTypeString
NSPasteboardTypeTIFF
NSPasteboardTypePNG
NSPasteboardTypeRTF
NSPasteboardTypeRTFD
NSPasteboardTypeHTML
NSPasteboardTypeTabularText
NSPasteboardTypeFont
NSPasteboardTypeRuler
NSPasteboardTypeColor
NSPasteboardTypeSound
NSPasteboardTypeMultipleTextSelection
NSPasteboardTypeTextFinderOptions
NSPasteboardTypeURL
NSPasteboardTypeFileURL

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	
	paste_text "<strong>Hello world</strong>" format "NSPasteboardTypeHTML" insert_by_pasting true
	
end tell
```
  

---

### **get_clipboard_content**
Gives you the current text content of the clipboard.

#### Example
```JavaScript
tell application "BetterTouchTool" to get_clipboard_content format "public.html" asBase64 false excludeConcealed false"


```

For the format parameter you can use any possible UTI or one of these strings:

Default formats are (more are possible):

* all - returns all currently stored formats as a JSON string
* NSPasteboardTypeString
* NSPasteboardTypeTIFF
* NSPasteboardTypePNG
* NSPasteboardTypeRTF
* NSPasteboardTypeRTFD
* NSPasteboardTypeHTML
* NSPasteboardTypeTabularText
* NSPasteboardTypeFont
* NSPasteboardTypeRuler
* NSPasteboardTypeColor
* NSPasteboardTypeSound
* NSPasteboardTypeMultipleTextSelection
* NSPasteboardTypeTextFinderOptions
* NSPasteboardTypeURL
* NSPasteboardTypeFileURL

---



### **get_selection**
Gives you the currently selected text/item

#### Example
```JavaScript
tell application "BetterTouchTool" to get_selection format "public.html" asBase64 false"

```

For the format parameter you can use any possible UTI or one of these strings:

Default formats are (more are possible):

* NSPasteboardTypeString
* NSPasteboardTypeTIFF
* NSPasteboardTypePNG
* NSPasteboardTypeRTF
* NSPasteboardTypeRTFD
* NSPasteboardTypeHTML
* NSPasteboardTypeTabularText
* NSPasteboardTypeFont
* NSPasteboardTypeRuler
* NSPasteboardTypeColor
* NSPasteboardTypeSound
* NSPasteboardTypeMultipleTextSelection
* NSPasteboardTypeTextFinderOptions
* NSPasteboardTypeURL
* NSPasteboardTypeFileURL


---

### **set_clipboard_content**
This changes the clipboard contentt

Parameters:

**content**: The text to paste.
**format**: Optional. The format the text will be interpreted as when pasting (e.g. if you want to paste a table, you can use set the string to ```<table>...</table>``` and specify the format NSPasteboardTypeHTML)

Default formats are (more are possible):

* NSPasteboardTypeString
* NSPasteboardTypeTIFF
* NSPasteboardTypePNG
* NSPasteboardTypeRTF
* NSPasteboardTypeRTFD
* NSPasteboardTypeHTML
* NSPasteboardTypeTabularText
* NSPasteboardTypeFont
* NSPasteboardTypeRuler
* NSPasteboardTypeColor
* NSPasteboardTypeSound
* NSPasteboardTypeMultipleTextSelection
* NSPasteboardTypeTextFinderOptions
* NSPasteboardTypeURL
* NSPasteboardTypeFileURL

#### Standard Apple Script Example:
```AppleScript
tell application "BetterTouchTool"
	
	set_clipboard_content "<strong>Hello world</strong>" format "NSPasteboardTypeHTML"
	
end tell
```
  
---

## Floating Menus
See [Scripting FLoating Menus](1603_scripting_floating_menus.md) for details.

### **update_menu_item**

Apple Script Example With Item UUID:
```AppleScript
tell application "BetterTouchTool"
	update_menu_item "044E5D2B-5661-4A1F-AB39-8D1EA2C1DBA1" json "{BTTMenuItemBackgroundColor: '20, 200, 20, 255', BTTMenuItemText: 'test' }"
end tell

```

Apple Script Example With Menu Name And Item Name:
```AppleScript
tell application "BetterTouchTool"
	update_menu_item menu_name "TheMenuName" item_name "TheItemName" json "{BTTMenuItemBackgroundColor: '20, 200, 20, 255', BTTMenuItemText: 'test' }"
end tell

```


### **get_menu_item_value**
Gets the current value of a floating menu item. For textfields the value is the entered text. For sliders it's the slider's value. For standard items, it's any files that have been dropped onto the item.

By menu name and item name:
```AppleScript
tell application "BetterTouchTool" to get_menu_item_value menu_name "TheMenuName" item_name "TheItemName"
```

By item UUID:
```AppleScript
tell application "BetterTouchTool" to get_menu_item_value "9DDA72BA-4968-4AC5-907E-FDE743B2F6E8"
```

### **set_menu_item_value**
Sets the current value of a floating menu item. 

By menu name and item name:
```AppleScript
tell application "BetterTouchTool" to set_menu_item_value menu_name "TheMenuName" item_name "TheItemName" value "testvalue"
```

By item UUID:
```AppleScript
tell application "BetterTouchTool" to set_menu_item_value "9DDA72BA-4968-4AC5-907E-FDE743B2F6E8" value 0.5
```




### **webview_menu_item_load_html_url_js**
Loads the provided html or url in the specified webview item in a floating menu.
```AppleScript
tell application "BetterTouchTool"
	# instead of the uuid you can also use the item_name and menu_name parameters.
	webview_menu_item_load_html_url_js "9E2989CF-77C7-4F14-A646-49342D2F8331" html_or_url "https://apple.com"
end tell
```

```AppleScript
tell application "BetterTouchTool"
	# instead of the uuid you can also use the item_name and menu_name parameters.
	webview_menu_item_load_html_url_js "9E2989CF-77C7-4F14-A646-49342D2F8331" javascript_to_execute "alert('hello world')"
end tell
```
