# Scripting BetterTouchTool using the custom URL Scheme

**Important**: This feature is mostly useful if you want to trigger BetterTouchTool functionality from outside of BTT. If you want to use scripts inside of BTT (like in Touch Bar widgets or script actions) use the [JavaScript](1106_java_script.md) or [Apple Script](1102_apple_script.md) scripting options.

BetterTouchTool allows to be control via a custom url scheme (btt://).
On this page I'm briefly describing the various functions you can trigger via this URL scheme.

**Note:** Custom URL Schemes **can not return values** to the calling application/browser. If you need that (e.g. after executing a shell script in BTT from outside of), please see the [Integrated Webserver](1104_webserver.md)

Custom URL Schemes always launch the app (BetterTouchTool) if it is not yet running.

- [Scripting BetterTouchTool using the custom URL Scheme](#scripting-bettertouchtool-using-the-custom-url-scheme)
  - [Security](#security)
  - [Available Scripting Interfaces](#available-scripting-interfaces)
    - [**trigger\_named**](#triggernamed)
    - [**trigger\_named\_async\_without\_response**](#triggernamedasyncwithoutresponse)
    - [**cancel\_delayed\_named\_trigger\_execution**](#canceldelayednamedtriggerexecution)
    - [**execute\_assigned\_actions\_for\_trigger**](#executeassignedactionsfortrigger)
    - [**trigger\_action**](#triggeraction)
    - [**refresh\_widget**](#refreshwidget)
    - [**update\_touch\_bar\_widget**](#updatetouchbarwidget)
    - [**update\_stream\_deck\_widget**](#updatestreamdeckwidget)
    - [**update\_menubar\_item**](#updatemenubaritem)
    - [**update\_trigger**](#updatetrigger)
    - [**add\_new\_trigger**](#addnewtrigger)
    - [**delete\_trigger**](#deletetrigger)
    - [**reveal\_element\_in\_ui**](#revealelementinui)
    - [**export\_preset**](#exportpreset)
    - [**import\_preset**](#importpreset)
    - [**run\_shortcut**](#runshortcut)
    - [**run\_shortcut\_async\_without\_response**](#runshortcutasyncwithoutresponse)
    - [**set\_persistent\_string\_variable**](#setpersistentstringvariable)
    - [**set\_string\_variable**](#setstringvariable)
    - [**set\_persistent\_number\_variable**](#setpersistentnumbervariable)
    - [**set\_number\_variable**](#setnumbervariable)
    - [**importviaurl**](#importviaurl)
    - [**jsonimport**](#jsonimport)


## Security
BetterTouchTool will ask you the first time you use a btt:// trigger whether you want to allow that. However it doesn't make sense to always continue asking that question as it would destroy the purpose of this.

So to improve security you can define a shared secret which then must be included in all btt:// urls like this: btt://the_function_you_want_to_use/?shared_secret=YourSecret

The shared secret can be defined in the advanced preferences
![shared_secret](media/new/scripting_secret.jpg)


## Available Scripting Interfaces

---

### **trigger_named**

This method will trigger the specified named trigger (which can be configured in the "Other" tab in BetterTouchTool.)

You can also pass additional parameters which will be set as BTT variables before the trigger is executed. This allows you to pass dynamic data to triggers.

| Parameter | Description |
|---|---|
| `trigger_name` | The name of the named trigger to execute |
| `cancel_delayed` | (optional) Set to 1 to cancel any pending delayed execution of this trigger |
| *any other key* | (optional) Any additional parameters will be set as BTT variables before executing the trigger |

```Bash
open "btt://trigger_named/?trigger_name=TriggerName"
```

```Bash
open "btt://trigger_named/?trigger_name=TriggerName&myVariable=someValue"
```

---

### **trigger_named_async_without_response**

Same as `trigger_named`, but executes asynchronously without waiting for a response. Useful when you don't need the result and want to avoid blocking.

| Parameter | Description |
|---|---|
| `trigger_name` | The name of the named trigger to execute |
| *any other key* | (optional) Any additional parameters will be set as BTT variables before executing the trigger |

```Bash
open "btt://trigger_named_async_without_response/?trigger_name=TriggerName"
```

---

### **cancel_delayed_named_trigger_execution**

Cancels a pending delayed execution of a named trigger.

| Parameter | Description |
|---|---|
| `trigger_name` | The name of the trigger whose delayed execution should be cancelled |

```Bash
open "btt://cancel_delayed_named_trigger_execution/?trigger_name=TriggerName"
```

---

### **execute_assigned_actions_for_trigger**
This method execute all the assigned actions for a given trigger (i.e. gesture, shortcut, drawing etc.) identified by its uuid.

You can get the uuid by right-clicking any configured trigger in BetterTouchTool.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the trigger whose actions should be executed |

```Bash
open "btt://execute_assigned_actions_for_trigger/?uuid=C40D3AE2-2F4E-49B1-A00C-F7E4C3632F07"
```

---

### **trigger_action**
This method will trigger any of BetterTouchTool's predefined actions (or any combination of them).

You need to provide a JSON description of the action you want to trigger. The easiest way to get such a JSON description is to right-click the trigger you have configured in BetterTouchTool and choose "Copy JSON". This will copy the complete JSON (including the configuration for the trigger itself), but this action will ignore anything that's not needed. (or you can delete the not needed parts)

| Parameter | Description |
|---|---|
| `json` | A JSON object describing the action to trigger |

```Bash
open "btt://trigger_action/?json={ \"BTTPredefinedActionType\" : 153, \"BTTPredefinedActionName\" : \"Move Mouse To Position\", \"BTTMoveMouseToPosition\" : \"{100, 10}\", \"BTTMoveMouseRelative\" : \"6\" }"
```

---

### **refresh_widget**
This method will execute all scripts assigned to a script widget and update its contents accordingly.

The widget is identified by its uuid, which you can get by right-clicking the widget in BetterTouchTool.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the widget to refresh |

```Bash
open "btt://refresh_widget/?uuid=C40D3AE2-2F4E-49B1-A00C-F7E4C3632F07"
```

---

### **update_touch_bar_widget**
This method will update the contents of a Touch Bar Script Widget (identified by its uuid). You can provide a new text to show, a new icon and a new background color.

For the icon you can either provide it directly using the icon_data parameter (must be base64 encoded) or you can provide a file path that points to the new icon (via the icon_path parameter).

You can get the uuid by right-clicking any script widget in BTT.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the Touch Bar widget to update |
| `text` | (optional) New text to display |
| `icon_path` | (optional) File path to a new icon |
| `icon_data` | (optional) Base64 encoded icon data |
| `background_color` | (optional) New background color as R,G,B,A values (e.g. `200,200,100,255`) |

```Bash
open "btt://update_touch_bar_widget/?uuid=CC46E199-B07D-4BF7-AC36-48AAE558540B&text=updatedText&icon_path=/Users/andi/Desktop/test.png&background_color=200,200,100,255"
```

---

### **update_stream_deck_widget**
This method will update the contents of a Stream Deck widget (identified by its uuid).

You can get the uuid by right-clicking the widget in BetterTouchTool.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the Stream Deck widget to update |
| `text` | (optional) New text to display |
| `json` | (optional) A JSON object with additional update properties |

```Bash
open "btt://update_stream_deck_widget/?uuid=CC46E199-B07D-4BF7-AC36-48AAE558540B&text=updatedText"
```

---

### **update_menubar_item**
This method will update the contents of a menu bar item (identified by its uuid).

You can get the uuid by right-clicking the menu bar trigger in BetterTouchTool.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the menu bar item to update |
| `text` | (optional) New text to display |
| `icon_path` | (optional) File path to a new icon |
| `icon_data` | (optional) Base64 encoded icon data |
| `background_color` | (optional) New background color |

```Bash
open "btt://update_menubar_item/?uuid=CC46E199-B07D-4BF7-AC36-48AAE558540B&text=updatedText"
```

---

### **update_trigger**
This method will update the configuration of any specified trigger (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide the uuid of the trigger you want to update (get by right-clicking it in BTT) and a JSON object defining the updates. To know how the JSON object should look like, right-click the trigger in BTT and choose "Copy JSON".

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the trigger to update |
| `json` | A JSON object defining the properties to update |

```Bash
open "btt://update_trigger/?uuid=0E2F7963-E64C-403A-8591-C3725D4D9ADC&json={\"BTTTouchBarButtonName\" : \"New Name2\",  \"BTTTriggerConfig\" : {\"BTTTouchBarItemIconHeight\" : 30}}"
```

---

### **add_new_trigger**
This method will add a new trigger to BTT (i.e. gestures, shortcuts, touchbar items etc.).

You need to provide a JSON object defining the new trigger. To know how the JSON object should look like, right-click any existing trigger in BTT and choose "Copy JSON".

| Parameter | Description |
|---|---|
| `json` | A JSON object describing the new trigger |
| `parent_uuid` | (optional) The UUID of the parent element to add the trigger to |

```Bash
open "btt://add_new_trigger/?json={ \"BTTTriggerClass\" : \"BTTTriggerTypeKeyboardShortcut\", \"BTTPredefinedActionType\" : 5, \"BTTPredefinedActionName\" : \"Mission Control\", \"BTTAdditionalConfiguration\" : \"1179658\", \"BTTTriggerOnDown\" : 1, \"BTTEnabled\" : 1, \"BTTShortcutKeyCode\" : 2, \"BTTShortcutModifierKeys\" : 1179648, \"BTTOrder\" : 3 }"
```

---

### **delete_trigger**
This method will delete a trigger from BetterTouchTool.
You need to provide the uuid of the trigger you want to delete (get by right-clicking it in BTT).

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the trigger to delete |

```Bash
open "btt://delete_trigger/?uuid=0E2F7963-E64C-403A-8591-C3725D4D9ADC"
```

---

### **reveal_element_in_ui**
This method will open the BetterTouchTool configuration UI and navigate to the specified trigger, revealing it in the interface. Useful for quickly jumping to a specific trigger's configuration.

| Parameter | Description |
|---|---|
| `uuid` | The UUID of the element to reveal |

```Bash
open "btt://reveal_element_in_ui/?uuid=0E2F7963-E64C-403A-8591-C3725D4D9ADC"
```

---

### **export_preset**
This method allows you to export a preset to a file.

| Parameter | Description |
|---|---|
| `name` | The name of the preset to export |
| `outputPath` | The file path where the preset should be saved |
| `compress` | (optional) Set to 1 to compress the exported preset |
| `includeSettings` | (optional) Set to 1 to include BTT settings in the export |
| `comment` | (optional) A comment to include in the export |
| `link` | (optional) A link to include in the export |
| `minimumVersion` | (optional) The minimum BTT version required for this preset |

```Bash
open "btt://export_preset/?name=MyPreset&outputPath=/Users/andi/Desktop/MyPreset.bttpreset&compress=1"
```

---

### **import_preset**
This method allows you to import a preset from a file path.

| Parameter | Description |
|---|---|
| `path` | The file path to the preset to import |
| `replaceExisting` | (optional) Set to 0 to keep existing presets with the same name. Defaults to 1 (replace). |

```Bash
open "btt://import_preset/?path=/Users/andi/Desktop/MyPreset.bttpreset"
```

---

### **run_shortcut**
This method runs an Apple Shortcuts shortcut by name and waits for its result.

| Parameter | Description |
|---|---|
| `shortcut_name` | The name of the Apple Shortcuts shortcut to run |
| `input` | (optional) Input to pass to the shortcut |

```Bash
open "btt://run_shortcut/?shortcut_name=MyShortcut&input=someInput"
```

---

### **run_shortcut_async_without_response**
Same as `run_shortcut`, but executes asynchronously without waiting for a response. Useful when you don't need the shortcut's result.

| Parameter | Description |
|---|---|
| `shortcut_name` | The name of the Apple Shortcuts shortcut to run |
| `input` | (optional) Input to pass to the shortcut |

```Bash
open "btt://run_shortcut_async_without_response/?shortcut_name=MyShortcut&input=someInput"
```

---

### **set_persistent_string_variable**
This allows you to set a variable to a given string that persists over BTT relaunches.

| Parameter | Description |
|---|---|
| `variableName` | The name of the variable |
| `to` | The string value to set |

```Bash
open "btt://set_persistent_string_variable/?variableName=test&to=12345"
```

---

### **set_string_variable**
This allows you to set a variable to a given string for the runtime of BTT.

| Parameter | Description |
|---|---|
| `variableName` | The name of the variable |
| `to` | The string value to set |

```Bash
open "btt://set_string_variable/?variableName=test&to=12345"
```

---

### **set_persistent_number_variable**
This allows you to set a variable to a given number that persists over BTT relaunches.

| Parameter | Description |
|---|---|
| `variableName` | The name of the variable |
| `to` | The number value to set |

```Bash
open "btt://set_persistent_number_variable/?variableName=test&to=12345"
```

---

### **set_number_variable**
This allows you to set a variable to a given number for the runtime of BTT.

| Parameter | Description |
|---|---|
| `variableName` | The name of the variable |
| `to` | The number value to set |

```Bash
open "btt://set_number_variable/?variableName=test&to=12345"
```

---

### **importviaurl**
This method allows you to import a BTT preset by providing a URL to download it from.

| Parameter | Description |
|---|---|
| *(path segment)* | The URL to download the preset from is provided as the path, not as a query parameter |

```Bash
open "btt://importviaurl/https://example.com/mypreset.bttpreset"
```

You can also use `btt://importviaurl/unzip/` if the downloaded file needs to be unzipped first:
```Bash
open "btt://importviaurl/unzip/https://example.com/mypreset.zip"
```

---

### **jsonimport**
This method allows you to import triggers directly via a base64-encoded JSON string in the URL. BetterTouchTool will show a confirmation dialog before importing.

| Parameter | Description |
|---|---|
| *(path segment)* | Base64-encoded JSON string describing the trigger(s) to import |

```Bash
open "btt://jsonimport/BASE64_ENCODED_JSON_HERE"
```

You can also use compressed JSON with `btt://jsonimport/uncompress/`:
```Bash
open "btt://jsonimport/uncompress/BASE64_ENCODED_COMPRESSED_JSON_HERE"
```

---
