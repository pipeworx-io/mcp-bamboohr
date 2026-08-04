# mcp-bamboohr

BambooHR MCP Pack — wraps the BambooHR API v1

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `bamboohr_list_employees` | List all employees with directory info. Returns IDs, names, departments, job titles, and contact details. |
| `bamboohr_get_employee` | Get detailed employee info by ID (e.g., "12345"). Specify fields like firstName, lastName, email, department. Returns requested data. |
| `bamboohr_get_directory` | Get complete employee directory with names, titles, departments, contact info, and manager assignments for all staff. |
| `bamboohr_list_timeoff` | Search time-off requests by date range (e.g., "2024-01-01" to "2024-12-31"). Returns approved/pending requests with employee names and absence types. |
| `bamboohr_get_employee_files` | Get files in an employee's profile by ID. Returns file names, upload dates, and file types. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "bamboohr": {
      "url": "https://gateway.pipeworx.io/bamboohr/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Bamboohr data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
