# h@llo.ai Context


To work well, AI Assistants often need some context about the environment they are running in. BetterTouchTool allows you to add such context and offers some defaults like Date & Time, Selected Text, Active Application, Active Document etc.
However just like tools, BTT doesn't add context by default as it is a complex balance that involves considerations about your context window, token usage and required interaction speed.

You can enable any of the default context items here:
![Context](media/hallo_ai_context_settings.png)

Be aware that enabling more context items also means a larger context size. This leads to higher token usage and often slower response times.


## Custom Contexts

If you want to provide custom, dynamic context to your AI Assistant you can go to the "Automations, Named & Other Triggers" section in BetterTouchTool and add a new "h@llo.ai - Custom AI Context"

![alt text](media/hallo_ai_context_details.png)

Custom context's are defined by a JavaScript function that can use all of BTT's scripting functionality, see [BetterTouchTool JavaScript](1106_java_script.md)

