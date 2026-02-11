# Custom WebView / HTML Renderer

**Note, October 14, 2023: With BetterTouchTool versions >= 4.25, the new [Floating Menus](./1600_floating_menus.md)
) can contain the webview described here by using web view items. This is very powerful and should be preferred instead of using the 'Show Floating WebView action'" **

The floating webview allows you to load arbitrary HTML or URLs and render it in a customizable browser window, which for example allows you to set the window level, transparency etc.. This alone would allow for some cool use cases like a floating Netflix player which stays on top of other windows. However what makes the Floating Webview really great is the ability to trigger arbitrary BetterTouchTool functions and even display their results.

Like any other action in BTT you can assign it to an arbitrary trigger so it can be shown by a Trackpad/Magic Mouse Gesture, Touch Bar button, Keyboard Shortcut etc.

### Example Use Cases:
- Floating Netflix / Youtube/ Whatever Video / Music players that stay on top of other windows and even work while in Full Screen mode
- Status widgets that stick to your desktop (behind all other windows)
- Application specific or global control widgets - e.g. to trigger functionality in your most used apps via a nice UI.
- Custom context menus

### How To
Have a look at these instructions on how to build your own floating webview:
* [Basic Setup & Providing Content](10_1_webview_basic_setup.md)
* [Appearance & Configuration options](10_1_webview_config.md)
* [Triggering BTT functionality from the webview](10_2_floating_menu_javascript.md)
* [Triggering & displaying the results of Terminal or Apple Scripts in the webview](10_3_webview_scripts.md)
* [WebView Lifcecycle & Notifications](10_4_webview_lifecycle.md)
* [Starter Template](10_5_webview_starter_template.md)
* [Development Tips & Tricks](10_6_webview_development.md)

### Some examples:
Some examples of how the BetterTouchTool community is already using the floating webview:


**Transparent webview that displays a fancy action menu:** (See <a href="https://folivora.ai/blog/post/13000">https://folivora.ai/blog/post/13000</a>)
<video src="https://folivora.ai/folivora/blog-media/example.mp4" autoplay="" muted="" loop="" style="width:50%">
        Sorry, your browser doesn't support embedded videos, but don't worry, you can
        <a href="https://folivora.ai/folivora/blog-media/example.mp4">download it</a>
        and watch it with your favorite video player!
    </video>

**Float websites like Youtube or Netflix on top of others:**

<video src="media/netflix.mp4" autoplay="" muted="" loop="" style="width:50%">
</video><br/><br/>


**A fully functional control center widget mimicking the iOS control center. Created by @yw4z, see <a href="https://community.folivora.ai/t/macos-control-center-mcc-v0-1/13058">https://community.folivora.ai/t/macos-control-center-mcc-v0-1/13058</a> for details.**

![mcc](media/mcc.jpg)

**A window resizing tool created by @yw4z, see <a href="https://community.folivora.ai/t/simple-window-manager-swm/12796">https://community.folivora.ai/t/simple-window-manager-swm/12796</a> for details.**


![mcc](media/swm.jpeg)
