# BetterTouchTool Stream Deck

Starting with version 3.800 BetterTouchTool supports all of the various Stream Deck devices: https://www.elgato.com/de/stream-deck

<iframe src="https://player.vimeo.com/video/725258330?h=bfcf2a452a&amp;title=0&amp;byline=0&amp;portrait=0&amp;speed=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" width="700" height="394" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Stream Deck in BetterTouchTool"></iframe>

## Examples to get started:

Download the example preset and look at the various examples described here.

[Example Preset Direct Link](https://folivora.ai/releases/ExampleStreamDeck.bttpreset)

List of examples:

* [Standard button with various formatting options applied](1301_stream_deck_standard_button.md)
* [Button with different actions for long press and short press](1302_stream_deck_long_press.md)
* [Button which repeats its actions while being pressed](1303_stream_deck_repeat.md)
* [Showing / changing buttons while holding other buttons](1304_changing_buttons_while_holding.md)
* [Showing buttons only on specific devices](1305_stream_deck_specific_devices.md)
* [Groups](1306_stream_deck_groups.md)
* [Stream Deck Pedal](1307_stream_deck_pedal.md)
* [App Specific Configurations](1308_stream_deck_appspecific.md)
* [Script Widgets](1309_script_widgets.md)
* [Custom Swift Plugins](1310_custom_swift_plugins.md)


## Basics:



### Operating Mode

BetterTouchTool supports two oeprating modes for the Stream Deck devices.

![stream_deck_modes](media/stream_deck_1.png)


### Mode 1 (preferred): Fully Controlled by BetterTouchTool

This is the preferred and most performant mode. 

In this mode, you must not be running the original Stream Deck software. BetterTouchTool directly talks to the Stream Deck devices.

In this mode you just configure everything in BetterTouchTool. No additional setup is necessary.

**This mode is only possible due to the open source code from the awesome Hammerspoon app. For even more advanced automations (via Lua scripting) you should check it out at https://www.hammerspoon.org/**

### Mode 2: Stream Deck Plugin

In this mode you'll need to install a Stream Deck Plugin and place multiple copies of it in your configuration in the original Stream Deck software. BetterTouchTool will then talk to the original Stream Deck software to render the buttons you configure. When pressing one of the buttons, the original Stream Deck software will talk to BetterTouchTool to execute the assigned actions.

In Plugin mode it is recommended to use fixed identifiers to correctly place the BTT items on your Stream Deck. See next.

![stream_deck_modes](media/stream_deck_plugin_mode.png)


## BetterTouchTool Stream Deck Layout Concept

The Stream Deck items in BTT are (like anything else in BTT) defined as a list. You can reorder that list by dragging the items around. 

By default BetterTouchTool starts placing buttons / widgets from that list on the top left of the Stream Deck and then just continues until the row is full. It then continues by placing items in the next row - and so on. If all rows are full, BTT automatically adds a new page and starts again on the top left of that page.

In case you do have some more dynamic scenario, the order defined by the list in BTT might not be enough. For these cases there are two additional options:

### 1.) Display Order
You can use the "display order" property in the settings of every item to define a additional 


### 2.) Fixed Position
However BetterTouchTool also allows you to specify specific positions for items. (e.g. row 3 col 2). If BTT is fully controlling the Stream Deck you can set the specific row and column in the item's configuration, otherwise you can tell BTT to place the item on a specific identifier defined in the Stream Deck app.

By default all buttons are visible on any connected Stream Deck device, however you can make them only display only on devices with specific serial numbers

### 3.) Fixed Identifier in Plugin Mode
When using BetterTouchTool in Plugin Mode, you can not specify the row / col directly. Instead you can set an identifier that matches the identifier you set in the Stream Deck software. 

![](media/streamdeck_folder_setup.png)  

