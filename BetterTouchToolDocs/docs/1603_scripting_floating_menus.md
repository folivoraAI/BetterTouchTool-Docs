# Scripting Floating Menus

## Dynamically retrieve content of Floating Menu

Starting with BetterTouchTool 4.764 you can use the new [Simple JSON Format](1108_simple_format.md) in combination with Java Script to dynamically retrieve the contents of a floating menu.

Have a look at [Simple JSON Format](1108_simple_format.md) for details on how to use it.

**Example**: Floating Menu App Switcher

Preset download (three finger swipe down to show the app switcher):
https://share.folivora.ai/sharedPreset/55076196-7d17-4b8f-bbae-4dbd17c3ad87

<img src="media/floating_menu_app_icons_circle.png" style="width:200px">


## Assigning a script to a floating menu item

Every floating menu item has the tab "Script", which allows you to add a script that can easily update the menu item's content and appearance - directly by returning either text or a JSON string, describing the attributes you want to update.

You can either use Apple Script like this:

```
on itemScript(itemUUID)
   return "{BTTMenuItemBackgroundColor: '0,0,20,255', BTTMenuItemText: 'Some New Text'}"
end itemScript
```

Or via Java Script like this:

```
async function itemScript(itemUUID) {
   return "{BTTMenuItemBackgroundColor: '0,0,20,255', BTTMenuItemText: 'Some New Text'}"
}
```

Menu items can also be updated from other scripts by using the update_menu_item function (see below)


### Updating the content or appearance of an item

The easiest way to update the content or appearance of a floating menu is to the predefined action "Update Floating Menu Item Properties" action. 
However if you need to update an item or menu from within a script there are two more ways to do so. The first way is to return a JSON5 compliant structure directly from the item's script like this:

<img style="max-height:500px" src="media/script_example.png"/><br/>,


This example updates the properties **BTTMenuItemBackgroundColor** and **BTTMenuItemText**.
In general you can see all the properties of a configured item by copying it to your clipboard and pasting it into a text editor.

However **BTTMenuItemText** is special. If you update this property, the menu will update the displayed text by applying the font and font styles you configured. For example if you made the first three letters bold and red, they will still appear bold and red with the new text you provided.

The second way is to change any property of an item via the **update_menu_item** function. It takes either the UUID of an item (*item_uuid*), or the name of the menu (*menu_name*) and the name of the item (*item_name*). Additionally it takes a string parameter called *json*. Every property you provide in the JSON parameter will be updated.
By default the change will not be persisted, but you can set persist to true, to do that.

To make escaping easier with Apple Script, BTT allows to use JSON5 in addition to standard JSON.

Apple Script Example With Item UUID:
```AppleScript
tell application "BetterTouchTool"
	update_menu_item "044E5D2B-5661-4A1F-AB39-8D1EA2C1DBA1" json "{BTTMenuItemBackgroundColor: '20, 200, 20, 255', BTTMenuItemText: 'test' }" persist true
end tell

```

Apple Script Example With Menu Name And Item Name:
```AppleScript
tell application "BetterTouchTool"
	update_menu_item menu_name "TheMenuName" item_name "TheItemName" json "{BTTMenuItemBackgroundColor: '20, 200, 20, 255', BTTMenuItemText: 'test' }" persist true
end tell

```

Java Script Example With UUID:

Note: the json parameter needs to be a string! This is why we use JSON.stringify here.
```JavaScript
(async ()=> {
   const updateDescription = {"BTTMenuItemText": "Hello World"};
   await update_menu_item({"item_uuid": "4FAAE4F8-5858-4444-A0E4-3498B7534CF2", "json": JSON.stringify(updateDescription), "persist": true})
   returnToBTT('done');
})()
```


---

## Getting The Value Of An Item
Every menu item can have an associated value. For slider items, it's the value of the slider. For text field items the entered text. Standard items only return a value if files have been dropped onto them - then they return the dropped files.

The current value of any floating menu item in BTT can be accessed like this:

**JavaScript:**

By menu name and item name:
```JavaScript
async function getItemValue() {
   let itemVal = await get_menu_item_value( {'menu_name': 'TheMenuName', 'item_name': 'TheItemName'});
   return itemVal;
}
```

By item UUID:
```JavaScript
async function getItemValue() {
   let itemVal = await get_menu_item_value({'item_uuid': '044E5D2B-5661-4A1F-AB39-8D1EA2C1DBA1'});
   return itemVal;
}
```


**Apple Script:**

By menu name and item name:
```AppleScript
tell application "BetterTouchTool" to get_menu_item_value menu_name "TheMenuName" item_name "TheItemName"
```

By item UUID:
```AppleScript
tell application "BetterTouchTool" to get_menu_item_value "9DDA72BA-4968-4AC5-907E-FDE743B2F6E8"
```

---

## Setting The Value Of An Item

The current value of any floating menu item in BTT can be changed like this:

**JavaScript:**

By menu name and item name:
```JavaScript
async function setItemValue() {
   let itemVal = await set_menu_item_value( {'menu_name': 'TheMenuName', 'item_name': 'TheItemName', 'value': 123});
   return itemVal;
}
```

By item UUID:
```JavaScript
async function setItemValue() {
   let itemVal = await get_menu_item_value({'item_uuid': '-4A1F-AB39-8D1EA2C1DBA1', 'value': 123});
   return itemVal;
}
```


**Apple Script:**

By menu name and item name:
```AppleScript
tell application "BetterTouchTool" to set_menu_item_value menu_name "TheMenuName" item_name "TheItemName" value 123
```

By item UUID:
```AppleScript
tell application "BetterTouchTool" to set_menu_item_value "9DDA72BA-4968-4AC5-907E-FDE743B2F6E8" value 123
```


## Loading Content Into A Web View Item or Executing Java Script

Possible parameters:
* item_uuid
* menu_name (only needed if no item_uuid is provided)
* item_name  (only needed if no item_uuid is provided)
* html_or_url
* javascript_to_execute
* useragent

Java Script Example: Load https://apple.com:
```JavaScript
(async ()=> {
   await webview_menu_item_load_html_url_js(
      {
         "item_uuid": "4FAAE4F8-5858-4444-A0E4-3498B7534CF2", 
         "html_or_url": "https://apple.com"
      }
   )
   returnToBTT('done');
})()
```

**Apple Script Example: Load https://apple.com**

```AppleScript
tell application "BetterTouchTool"
	# instead of the uuid you can also use the item_name and menu_name parameters.
	webview_menu_item_load_html_url_js "9E2989CF-77C7-4F14-A646-49342D2F8331" html_or_url "https://apple.com"
end tell
```

**Java Script Example: Show Alert**:
```JavaScript
(async ()=> {
   await webview_menu_item_load_html_url_js( 
      {
         "menu_name": "TheMenuName", 
         "item_name": "TheItem", 
         "javascript_to_execute": "alert('hello world');"
      }
   )
   returnToBTT('done');
})()
```

**Apple Script Example: Show Alert**

```AppleScript
tell application "BetterTouchTool"
	# instead of the uuid you can also use the item_name and menu_name parameters.
	webview_menu_item_load_html_url_js "9E2989CF-77C7-4F14-A646-49342D2F8331" javascript_to_execute "alert('hello world')"
end tell
```

**Execute Java Script**

## Get dropped item values

```AppleScript
tell application "BetterTouchTool" to get_menu_item_value menu_name "DropTest" item_name "DropItem"
```

```
async function getDroppedItems() {
   let droppedPaths = await get_menu_item_value({'menu_name': 'DropTest', 'item_name': 'DropItem'});
   
   return droppedPaths;

}

async function runShortcutWithDroppedItems() {
	async function getDroppedItems() {
   let droppedPathsString = await get_menu_item_value( {'menu_name': 'DropTest', 'item_name': 'DropItem'});
   
   let droppedPathsArray = JSON.parse(droppedPathsString);
   let spaceSeparatedPaths =  `${droppedPathsArray.join(';;')}`;
   
   
   BTT.runAppleShortcut({name: 'fileinputtest', input: spaceSeparatedPaths});   
   return spaceSeparatedPaths;

}
}
```