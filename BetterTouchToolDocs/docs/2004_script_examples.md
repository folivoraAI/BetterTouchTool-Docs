Set volume

```JS
async function someFunctionName() {
     set_number_variable({ variableName: "OutputVolume", to: 0.5 }); //50%
}
```

Shell Script
```JS
async function someJavaScriptFunction() {
  let path_or_url = await get_clipboard_content({format: "public.file-url" /*optional*/, asBase64: false, excludeConcealed: false});

  let cfg = {
    script: `/opt/homebrew/bin/airdrop ${path_or_url}`,
    launchPath: "/bin/bash",
    parameters: "-c",
  };
  let result = await runShellScript(cfg);
  
  return result;
}
```

Get Running Apps
```JS

async function someJavaScriptFunction() {
let apps = await BTTActions.copyLaunchedApplicationsInFrontToBackOrder();
s
let appsString = JSON.stringify(apps);

await set_string_variable({variableName: "something", to: appsString});
		
}
```