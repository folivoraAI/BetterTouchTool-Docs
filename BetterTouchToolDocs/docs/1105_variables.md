## Using Variables in BetterTouchTool
Variables in BTT can be quite useful [when using Apple Script / Java Script and the like](1101_scripting_btt.md)
There are three types of variables:

* Temporary Variables - will only be available until BTT quits
* Persistent Variables - will be persisted and be available all the time
* Dynamic Variables - they are calculated dynamically. BTT comes with a small set of helpful dynamic variables. 


## Dynamic Variables provided by BTT:

**Important: ALL variables** you can see in Conditional Activation Groups or in Advanced Trigger Conditions can also be queried via script!

* **selected_text** - The currently selected text. Readonly.
* **BTTActiveWindowTitle** - The title of the ative window. Readonly.
* **ActiveSpace** - The ID number of the active space
* **OutputVolume** - The current output volume of the system. Readable and writable.
* **BuiltInDisplayBrightness** - The brightness of the built in display. Readable and writable.
* **BTTCurrentlyPlaying** - This variable returns whether the system is currently playing music/video (1 or 0). When called it also starts to observe further details and will make the following variables available:
    * **BTTNowPlayingInfoArtist**
    * **BTTNowPlayingInfoTitle**
    * **BTTNowPlayingInfoAlbum**
    * **BTTNowPlayingInfoDuration**
    * **BTTNowPlayingInfoTrackNumber**

* **BTTTouchBarVisible** - Tells you whether the BTT custom Touch Bar is currently visible or not.

* **BTTCurrentlyPlayingApp** - the app identifier of the app that is currently playing video or audio. Read only.

* **BTTInternalNightShiftState** - Is the BTT night shift currently active or not? (Does not necessarily represent the system night shift state)

* **SystemDoNotDisturbState** - The current state of "do not disturb". Readable & writable.
* BluetoothConnectionState-**MACADRESS-OR-NAME** - Returns whether a device is connected. Can contain wildcards (kind of dynamic-dynamic variable). E.g. BluetoothConnectionState-*Airpod*. Radable and writable.
* **BTTActiveAppBundleIdentifier** - The bundle identifier of the currently active app. Readonly.
* **BTTActiveWindowNumber** - The window number of the active window (to identify a window). Readonly.
* **BTTTouchBarHasPhysicalESCKey** - Is 1 if the TouchBar Macbook has a physical ESC key. Readonly.
* **BTTLastTriggeredAction** - The id of the last triggered BTT action. Readonly.
* **BTTLastTriggeredUUID** - The UUID of the last triggered BTT action. Readonly.
* **BTTLastTriggerTime** - The timestamp when the last BTT action was triggered.

You can always see your temporary and dynamic variables in the BetterTouchTool settings:
![webserver](media/bttvariables.png)

## Advanced Trigger Condition Variables

Every variable that can be used inside of [advanced trigger conditions or conditional activation groups](1400_conditions.md) can also be used anywhere else where variables can be used. As of version 4.865 these advanced trigger condition variables are available:

- `color_under_cursor`
- `focused_element_role`
- `focused_element_subrole`
- `selected_text`
- `connected_wifi_name`
- `active_website_url`
- `focused_window_title`
- `focused_window_app_name`
- `active_app_name`
- `active_app_bundle_identifier`
- `left_mouse_down`
- `middle_mouse_down`
- `right_mouse_down`
- `currently_pressed_mouse_buttons`
- `currently_pressed_keyboard_keys`
- `trackpad_id`
- `fingers_touching_trackpad`
- `trackpad_touch_duration`
- `thumb_recognized`
- `thumb_x_percent`
- `thumb_y_percent`
- `leftmost_touch_x`
- `leftmost_touch_y`
- `rightmost_touch_x`
- `rightmost_touch_y`
- `fingers_touching_magic_mouse`
- `magic_mouse_touch_duration`
- `leftmost_mouse_touch_x`
- `leftmost_mouse_touch_y`
- `rightmost_mouse_touch_x`
- `rightmost_mouse_touch_y`
- `mouse_position_x`
- `mouse_position_y`
- `mouse_pos_percent_x`
- `mouse_pos_percent_y`
- `window_titlebar_hovered`
- `dist_x_active_win_top_left`
- `dist_y_active_win_top_left`
- `dist_x_active_win_top_right`
- `dist_y_active_win_top_right`
- `dist_x_active_win_bottom_left`
- `dist_y_active_win_bottom_left`
- `dist_x_active_win_bottom_right`
- `dist_y_active_win_bottom_right`
- `percent_x_active_win_btm_left`
- `percent_y_active_win_btm_left`
- `percent_x_hovered_win_btm_left`
- `percent_y_hovered_win_btm_left`
- `mouse_screen_x`
- `mouse_screen_y`
- `mouse_screen_width`
- `mouse_screen_height`
- `focused_screen_x`
- `focused_screen_y`
- `focused_screen_width`
- `focused_screen_height`
- `focused_window_x`
- `focused_window_y`
- `focused_window_width`
- `focused_window_height`
- `hovered_floating_menu_identifier`
- `visible_floating_menu_identifiers`
- `fullscreen_active`
- `active_screen_resolutions`
- `missioncontrol_active`
- `currently_blocking_keyboard`
- `power_source`
- `battery_level`
- `active_space`
- `darkmode_active`
- `current_minute`
- `current_hour`
- `current_day`
- `current_weekday (SUN = 1)`

And these are available via the Conditional Activation Groups:

- `bundleIdentifier`
- `processName`
- `runningProcesses`
- `appName`
- `appExecutablePath`
- `windowName`
- `connectedWifiName`
- `activeWebsiteURL`
- `activeTouchBarGroup`
- `focusedElementRole`
- `focusedElementSubrole`
- `customVariable1`
- `customVariable2`
- `customVariable3`
- `customVariable4`
- `customVariable5`
- `activeScreenResolutions`
- `currentlyPressedStreamDeckButtonIdentifiers`
- `hovered_floating_menu_identifier`
- `visible_floating_menu_identifiers`
- `BTTCurrentlyPlayingApp`
- `BTTCurrentlyPlaying`
- `mouseBehindNotch`
- `currentlyBlockingKeyboard`

Some other variables that might be available depending on the context:

- `mouse_screen_x`
- `mouse_screen_y`
- `mouse_screen_width`
- `mouse_screen_height`
- `focused_screen_x`
- `focused_screen_y`
- `focused_screen_width`
- `focused_screen_height`
- `pinned_window_ids`
- `BTTActiveWindowTitle`
- `BTTActiveWindowNumber`
- `currentlyBlockingKeyboard`
- `BTTLastTerminalCommandResult`
- `BTTMagicMouseTouchpadModeActive`
- `BTTSiriRemoteMouseModeActive`
- `BTTFinderContextMenuTriggeredUUID`
- `BTTFinderContextMenuTargetPath`
- `BTTFinderContextMenuSelectedItemPaths`
- `CurrentKeyboardInputSource`