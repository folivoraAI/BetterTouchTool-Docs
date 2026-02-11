# BetterTouchTool Floating Menu JSON Documentation

This document describes the JSON structure for creating floating menus in BetterTouchTool.

**NOTE** Some text is replaced with special characters to reduce the size of this document for LLM usage:
    © = BTT
    $ = BTTMenu
    § = BTTMenuItem

## Basic Structure

A floating menu JSON is an array containing menu objects. Each menu can contain multiple menu items via the `§s` array.

```json
[
  {
    "©TriggerType": 767,
    "©TriggerTypeDescriptionReadOnly": "Floating Menu",
    "©TriggerClass": "©TriggerTypeFloatingMenu",
    "©UUID": "unique-uuid-here",
    "©Enabled": 1,
    "©TriggerName": "Floating Menu: Menu Name",
    "$Name": "Menu Name",
    "$Config": { /* menu configuration */ },
    "§s": [ /* array of menu items */ ],
    "$Availability": 0  /* 0=everywhere, 1=mac, 2=ios */
  }
]
```

## Menu Item Types (`©TriggerType`)

- **767** - Menu (top level)
- **773** - Standard Item (button with actions)
- **774** - Submenu (contains nested items)
- **775** - Slider
- **776** - Text Field (value queryable via scripts)
- **777** - Back Button (for submenus)
- **778** - WebView (displays HTML from §Text)
- **800** - Trackpad widget
- **801** - Row Breaker
- **802** - Column Breaker
- **810** - Text Area (value queryable via scripts)
- **811** - Floating Menu Reference

## Menu Properties

### Core Properties
- `©TriggerType`: 767 for menu
- `©UUID`: Unique identifier
- `©Enabled`: 1 to enable
- `$Name`: Display name
- `$Config`: Configuration object
- `§s`: Array of menu items
- `$Availability`: 0=everywhere, 1=mac, 2=ios, 3=iphone, 4=ipad
- `©Order`: Display order
- `©LastUpdatedAt`: Timestamp
- `©AppBundleIdentifier`: App-specific bundle ID
- `©AppName`: App-specific name

### Item Properties
- `©TriggerType`: Item type (773, 774, etc.)
- `©TriggerParentUUID`: Parent menu's UUID
- `©UUID`: Unique identifier
- `©Enabled`: 1 to enable
- `©TriggerName`: Display name
- `$Config`: Item configuration
- `§Actions`: Array of actions

## Menu Configuration (`$Config`)

### Positioning & Layout
- `$PositioningType`: 0=freeMove, 1=fixedPosition, 2=menubarStatusItem
- `$PositionRelativeTo`: 0=focusedWindow, 1=screenWithMouse, 3=focusedScreen, 7=mousePosition, 8=builtin, 11=notch, 12=focusedMenubar, 19=screenWithDock, 20=greenWindowButton, 21=hoveredFloatingMenuItem, 22=specificFloatingMenu, 23=dock
- `$AnchorMenu`: 0=topLeft, 1=topRight, 2=bottomLeft, 3=bottomRight, 4=center, 5=topEdgeCenter, 6=rightEdgeCenter, 7=bottomEdgeCenter, 8=leftEdgeCenter
- `$AnchorRelation`: Same values as $AnchorMenu
- `$OffsetX`/`$OffsetY`: Position offset
- `$OffsetXUnit`/`$OffsetYUnit`: 0=absolute, 1=menu%, 2=referenceFrame%
- `$PositionDynamicVariable`: Variable for dynamic positioning
- `$ScreenUUID`: Specific screen UUID

### Layout Direction
- `$LayoutDirection`: 0=fillRow, 1=fillColumn, 2=fillRowFixed, 3=fillColumnFixed, 4=absoluteScrollable, 5=absoluteFixed, 6=verticalOneColumn, 7=horizontalOneRow, 8=circular
- `$VerticalSpacing`: Vertical spacing (pixels)
- `$HorizontalSpacing`: Horizontal spacing (pixels)

### Size
- `$SizingBehavior`: 0=zero, 1=fixed, 2=variable, 3=content
- `$FrameWidth`/`$FrameHeight`: Menu dimensions
- `$FrameMaxWidth`/`$FrameMaxHeight`: Maximum dimensions
- `$FrameWidthVariable`/`$FrameHeightVariable`: Variable names for dynamic sizing

### Hover Behavior
- `$ResizeOnHover`: 1 to enable hover resize
- `$SizingBehaviorHover`: Hover sizing mode
- `$FrameWidthHovered`/`$FrameHeightHovered`: Hovered dimensions
- `$FrameWidthVariableHover`/`$FrameHeightVariableHover`: Hover variables
- `$HoverKeepExpanded`: 1 to stay expanded
- `$GoBackToNonHoveredSizeAfter`: Seconds to collapse
- `$HoverExpansionDirection`: 0=rightUp, 1=leftUp, 2=rightDown, 3=leftDown, 4=leftRightDown, 5=leftRightUp, 6=upDownLeft, 7=upDownRight
- `$HoverStartAnimationDuration`/`$HoverEndAnimationDuration`: Animation durations
- `$HoverDelay`: Hover activation delay
- `$HoverWhileMousePressed`: 1 to hover while dragging
- `§AnimateHover`: 1 to animate hover

### Window Properties
- `$WindowLevel`: 3=floating, 0=normal, 20=dock, 24=mainMenu, -1=custom
- `$WindowLevelManual`: Custom level when $WindowLevel=-1
- `$WindowResizable`: 1 to allow resizing
- `$TitleBarStyle`: 0=noTitleBar, 1=standard, 2=overlayContent, 3=transparent
- `$ClickThroughEmptyParts`: 1 to click through empty areas
- `$ClickThroughEverywhere`: 1 to click through everywhere
- `$ShowDockIconWhileVisible`: 1 to show dock icon
- `$StealKeyboardFocusOnShow`: 1 to steal focus

### Visibility
- `$Visibility`: 0=onLaunch, 1=viaAction
- `$OpacityActive`/`$OpacityInactive`: Opacity 0-1
- `$AlwaysUseLightMode`: 1 to force light mode
- `$KeepCached`: 1 to keep cached when hidden
- `$AnimateShow`: 1 to animate appearance
- `$AnimateShowDuration`: Animation duration
- `$AnimateChanges`: 1 to animate property changes

### Visibility Conditions
- `$ShowIfWindowTitleIsNotEmpty`: 1 to check
- `$ShowIfWindowTitleContains`: String to match
- `$ShowIfAppNameContains`: String to match
- `$ShowIfWindowTitleContainsNot`: String to exclude
- `$ShowIfAppNameContainsNot`: String to exclude
- `$ShowIfWindowLevelEqualsEnabled`: 1 to enable check
- `$ShowIfWindowLevelEquals`: Window level value
- `$DoNotShowInFullscreen`: 1 to hide in fullscreen
- `$OnlyShowOnSpaces`: Comma-separated space numbers

### Interaction
- `$CloseOnOutsideClick`: 1 to close on outside click
- `$CloseOnMoveMouseAway`: 1 to close when mouse leaves
- `$CloseOnKeyboardInput`: 1 to close on keyboard
- `$CloseAfterAction`: 1 to close after action
- `$DisableDrag`: 1 to disable dragging

### Modifiers
- `§sUseModifierModes`: true if items use modifiers
- `$ModifierMode`: -1=none, 0=showIfPressed, 1=showIfOthersPressed, 2=showIfNonePressed, 3=showAlways, 4=showIfPressedShowNonModified, 5=showIfAtLeast, 6=dontShowIfPressed
- `$ModifierKeys`: Bitmask of modifier keys

### Scripting
- `§ScriptActive`: 1 to enable script
- `$ScriptSettings`: Script configuration object
- `$ValueChangedScriptSettings`: Script for value changes
- `$ScriptRunOnMenuHover`: 1 to run on menu hover
- `$ScriptRunOnItemHover`: 1 to run on item hover
- `$ScriptAlwaysRunOnFirstLoad`: 1 to run on load
- `$ScriptUpdateInterval`: Update interval in seconds
- `$ScriptAlwaysRunOnAppear`: 1 to run on appear

### Script Configuration (`$ScriptSettings`)
- `©ScriptType`: 0=appleScript, 1=jax, 2=scpt, 3=realJavaScript, 4=shortcut
- `©AppleScriptString`: Script content
- `©ScriptFunctionToCall`: Function name
- `©ScriptShortcutName`: Shortcut name
- `©ScriptLocation`: 0=inline, 1=preset, 2/3=external
- `©ScriptExternalPath`: External script path
- `©JavaScriptUseIsolatedContext`: true for isolated JS

### Item Properties

#### Visibility
- `§Disabled`: 1 to disable
- `§VisibleWhileActive`: 1 when menu hovered
- `§VisibleWhileInactive`: 1 when not hovered
- `§VisibleIfVariableIsTrue`: Variable name
- `§VisibleIfVariableIsFalse`: Variable name
- `§DisplayOrder`: Custom order value

#### Size & Position
- `§MinWidth`/`§MaxWidth`: Width constraints
- `§MinHeight`/`§MaxHeight`: Height constraints
- `§PaddingLeft`/`Right`/`Top`/`Bottom`: Internal padding
- `§MarginLeft`/`Right`/`Top`/`Bottom`: External margin
- `§PositioningMode`: 1 for manual positioning
- `§X`/`§Y`: Manual position
- `§OffsetX`/`§OffsetY`: Position offset

#### Text
- `$AttributedText`: RTF-encoded text
- `$AttributedTextDark`: Dark mode RTF text
- `§Text`: Plain text/HTML (for webviews)
- `$ElementIdentifier`: Scripting identifier
- `$ElementTooltip`: Tooltip text
- `§ShowIdentifierAsTooltip`: 1=identifier, 2=tooltip
- `$TextMinimumScaleFactor`: Min scale 0-1
- `$TextOffsetX`/`$TextOffsetY`: Text offset
- `§FontColor`/`§FontColorHover`: Font colors

#### Background
- `§BackgroundType`: 0=none, 1=data, 2=sfsymbol, 3=file, 4=color, 5=linearGradient, 6=radialGradient, 7=presetFile, 8=internal
- `§BackgroundColor`/`2`/`3`/`4`: Gradient colors "R,G,B,A"
- `§BackgroundColorHover`: Hover background
- `§BackgroundImageData`: Base64 image data
- `§BackgroundImagePresetPath`: Preset path
- `§BlurredBackground`: 1 for blur effect
- `§BackgroundTypeDark`/`ColorDark`/etc.: Dark mode variants

#### Borders
- `§BorderWidth`: Border width
- `§BorderColor`: Border color "R,G,B,A"
- `§BorderColorHover`: Hover border color
- `§BorderDashed`: 1 for dashed
- `§CornerRadius`: Corner radius
- `§CornerRadiusCorners`: 0=all, 1=left, 2=right, 3=top, 4=bottom, 5=topLeft, 6=topRight, 7=bottomRight, 8=bottomLeft
- Dark mode variants with `Dark` suffix

#### Shadow
- `§ShadowEnabled`: 1 to enable
- `§ShadowColor`/`ColorHover`: Shadow colors
- `§ShadowRadius`: Shadow radius
- Dark mode variants with `Dark` suffix

#### Icons/Images
- `§IconType`: Same as §BackgroundType
- `§IconPosition`: 0=left, 1=top, 2=right, 3=bottom, 4=center, 5=none
- `§Image`: Base64 image data
- `§IconPresetPath`: Preset icon path
- `§ResizeImage`: 0=fit, 1=none, 2=fixed, 3=fitNew
- `§ImageChangeColor`: 1 to tint with color
- `§ImageWidth`/`Height`: Image dimensions
- `§ImageOffsetX`/`Y`: Image offset
- `§ImagePadding`: Image padding

#### SF Symbols
- `§SFSymbolName`: Symbol name
- `§SFSymbolWeight`: Symbol weight
- `§SFSymbolStyle`: 0=monochrome, 1=hierarchical, 2=palette, 3=multiColor
- `§IconColor1`/`2`/`3`: Symbol colors
- `§IconColor1Hover`/`2Hover`/`3Hover`: Hover colors
- Dark mode variants with `Dark` suffix

#### WebView Properties
- `§WebViewPlain`: 1 for plain HTML
- `§UserAgent`: Custom user agent
- `§UserScript`: Script on load
- `§UserScriptOnvisible`: Script on visible
- `§WebViewFocusTextField`: 1 to auto-focus
- `§WebViewFocusTextFieldWithID`: Field ID
- `§KeepActiveInBackground`: 1 to keep active
- `§SystemBrowserPrefix`: External URL prefixes
- `§SystemBrowserPrefixOverrides`: Override prefixes
- `§SystemBrowserClosesMenu`: 1 to close on external

#### Circular Layout
- `$HoverOnWholePizzaSlice`: 1 for whole wedge hover
- `$HighlightPizzaSlice`: 1 to highlight wedge
- `$PlaceFirstItemAtCenter`: 1 to center first item
- `§PizzaSliceBackgroundColor`: Wedge background
- `§PizzaSliceBorderColor`: Wedge border
- `§PizzaSliceBorderWidth`: Border width
- Dark mode variants with `Dark` suffix

#### Interaction
- `§Focused`: 1 for initial focus
- `§ScrollEnabled`: 1 to enable scroll
- `§ScrollDelta`: Touch scroll delta
- `§ScrollDeltaNormalMouse`: Mouse scroll delta

#### Widget Properties
- `$WidgetStringStringDictionary`: String dictionary
- `$WidgetStringIntDictionary`: Integer dictionary
- `$WidgetNowPlayingPauseBehavior`: 0=icon, 1=albumcover


#### Miscellaneous
- `$UseStyleForSubmenu`: 1 to inherit parent style
- `$OverrideGlobalMenuSetttings`: 1 to override globals
- `$CreatedViaScript`: 1 if script-created
- `$OnlyCopyOpenCategories`: 1 for categories
- `§Extras`: Extra data (future use)
- `©AnimateUUID`: Animation trigger UUID
- `©LastChangeUUID`: Last change UUID

## Actions (`§Actions`)
```json
"§Actions": [{
  "©PredefinedActionType": 5,
  "©PredefinedActionName": "Mission Control",
  "©Enabled": 1,
  "©Order": 0
}]
```

## Example: Complete Menu
```json
[{
  "©TriggerType": 767,
  "©UUID": "menu-uuid",
  "©Enabled": 1,
  "$Name": "Example Menu",
  "$Config": {
    "$PositioningType": 1,
    "$PositionRelativeTo": 3,
    "$AnchorMenu": 1,
    "$AnchorRelation": 1,
    "$FrameWidth": 220,
    "$FrameHeight": 300,
    "$OpacityActive": 1,
    "$OpacityInactive": 0.8,
    "$LayoutDirection": 0,
    "$VerticalSpacing": 5,
    "$HorizontalSpacing": 5,
    "$WindowLevel": 3,
    "$CloseAfterAction": 1
  },
  "§s": [{
    "©TriggerType": 773,
    "©TriggerParentUUID": "menu-uuid",
    "©UUID": "item-uuid",
    "©Enabled": 1,
    "$Name": "Click Me",
    "$Config": {
      "§VisibleWhileActive": 1,
      "§VisibleWhileInactive": 1,
      "§MinWidth": 100,
      "§MinHeight": 50,
      "§BackgroundType": 4,
      "§BackgroundColor": "90, 180, 240, 255",
      "§BackgroundColorHover": "120, 200, 255, 255",
      "§CornerRadius": 10,
      "§BorderWidth": 2,
      "§BorderColor": "255, 255, 255, 128",
      "$AttributedText": "{\\rtf1 Click Me}",
      "§IconType": 2,
      "§SFSymbolName": "hand.tap",
      "§IconColor1": "255, 255, 255, 255"
    },
    "§Actions": [{
      "©PredefinedActionType": 5,
      "©PredefinedActionName": "Mission Control"
    }]
  }]
}]
```

## Color Format
Colors use "R, G, B, A" format (0-255): "255, 0, 0, 255" = opaque red

## Import Method
```javascript
ai.create_bettertouchtool_trigger(json: theJSONAsString)
```
