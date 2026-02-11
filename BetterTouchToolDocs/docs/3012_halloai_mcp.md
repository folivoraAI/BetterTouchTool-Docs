# h@llo.ai MCP

BetterTouchTool's MCP server configuration by default is stored in this file:
~/Library/Application Support/BetterTouchTool/AI/btt-mcp-config.json

You can either edit it directly in your favorite text editor or in BTT's UI.


Example configuration:

```JSON
{
  "mcpServers": {
    "shell": {
      "command": "uvx",
      "args": [
        "mcp-shell-server"
      ],
      "env": {
        "ALLOW_COMMANDS": "say, ls,cat,pwd,grep,wc,touch,find"
      }
    },
    "sequential-thinking": {
		"command": "npx",
		"args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
	}
  }
}
```

**Imortant** Even after configuring your mcp json file, you still need to activate the MCP tools individually for any of your assistants. This is done in the [Tools & Context section in the configuration](3009_halloai_tools.md)

### Alternative Configuration Locations
It can also be stored in these files - however you should pick one and stick with that.

"~/.config/btt/mcp/.mcp.json"

"~/.btt/mcp/.mcp.json"

"~/Library/Application Support/BetterTouchTool/AI/"

"/Library/Application Support/BetterTouchTool/AI/"


      