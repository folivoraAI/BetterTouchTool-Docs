# Useful Script Examples

1. Execute a different action when triggering twice in quick succession.

## Execute different actions when executing a once and when executing it twice in quick succession:

`Taken from: https://community.folivora.ai/t/key-sequences-typed-words/23587/11`

This is useful if you want to e.g. have a keyboard shortcut that performs function A when hitting it once and performs function B when hitting it twice in quick succession. Also works for other trigger types.

Assign the "Run Real JavaScript" action to a trigger (e.g. shortcut) in BTT and paste this script.

It will trigger the named trigger defined in line 2, when doing a single press. It will trigger the named trigger you defined in line 3 when doing a double press. It will wait for 0.3 seconds before executing the single press (to see whether a double press will happen) - that time can be changed by modifying line 4.

```Javascript
(async () => {
  let singleTapNamedTrigger = 'SingleTap'; // trigger on single press
  let doubleTapNamedTrigger = 'DoubleTap'; // trigger on double press
  let delay = 0.3; // time to wait for second press


  // no modifications necessary from here
  let now = Date.now() / 1000;
  let lastTrigger = await get_number_variable({
    variable_name: 'last_key_trigger_time',
  });

  if (now - lastTrigger < delay) {
    cancel_delayed_named_trigger_execution({
      trigger_name: singleTapNamedTrigger,
    });

    trigger_named_async_without_response({
      trigger_name: doubleTapNamedTrigger,
      wait_for_reply: false,
    });
  } else {
    trigger_named_async_without_response({
      trigger_name: singleTapNamedTrigger,
      wait_for_reply: false,
	  delay: delay

    });
  }

  set_number_variable( {
    variable_name: 'last_key_trigger_time',
    to: now,
  });

  returnToBTT('done');
})();
```

Note: If you just want to cycle through multiple actions when triggering a shortcut multiple times, use the predefined action "Cycle Through Multiple Actions" instead.

## Send A Keyboard Shortcut Via BTT From Within A Apple Script

Taken from https://community.folivora.ai/t/applescript-execution-output-varies-based-on-trigger-method/31504/6

This example would send the cmd+c shortcut to copy something. Using BetterTouchTool for this instead of system events, does have some advantages - for example it will work while other modifier keys are still pressed.

55 = cmd
8 = c 

You can find a list of key codes here: https://eastmanreference.com/complete-list-of-applescript-key-codes

The format always needs to be modifier,modifier,keycode (there can be any number of modifiers but the keycode must come last)

```AppleScript
tell application "BetterTouchTool"
	
	trigger_action "{\"BTTTriggerType\":-1, \"BTTShortcutToSend\" : \"55,8\",}"
	
end tell
```