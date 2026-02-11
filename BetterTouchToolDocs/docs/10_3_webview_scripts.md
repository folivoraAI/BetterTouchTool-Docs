You can run Apple Scripts and Shell Scripts right from within the webview HTML using the **runAppleScript** (or **runJXA**) and **runShellScript** JavaScript functions that are automatically made available.

## Running Apple Scripts from the WebView
```HTML
<html>
<head>
<script>
```
```JAVA
async function runSomeAppleScript() {

// put the Apple Script into a string (back ticks are great for multi -line strings)
let appleScript = `
    set theDialogText to "The curent date and time is " & (current date) & "."
    set result to display dialog theDialogText
    return result
`;

// this will execute the Apple Script and store the result in the result variable.
// if you want to use JavaScript for Automation use runJXA instead
let result = await runAppleScript({script: appleScript});

//do whatever you want with the result
document.getElementById("testButton").value=result;
console.log('result', result);

}
```
```HTML
</script>
</head>
<body>
<button id="testButton" onclick="runSomeAppleScript()">Run Apple Script</button>
</body>
</html>

```


## Running Shell Scripts from the WebView

```HTML
<html>
<head>
<script>
```
```JAVA
async function runSomeShellScriptScript() {
    
// put the shell script into a string (single backticks are great for multiline strings)
let shellScript = `say hello world`;


let shellScriptWrapper = {
    script: shellScript, // mandatory
    launchPath: '/bin/bash', //optional - default is /bin/bash
    parameters: '-c', // optional - default is -c
    environmentVariables: '' //optional e.g. VAR1=/test/;VAR2=/test2/;
};

// this will execute the Shell Script and store the result in the result variable.
let result = await runShellScript(shellScriptWrapper);

//do whatever you want with the result
document.getElementById("testButton").value=result;
console.log('result', result);

}
```
```HTML
</script>
</head>
<body>
<button id="testButton" onclick="runSomeShellScriptScript()">Run Shell Script</button>
</body>
</html>

```
