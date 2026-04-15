# mcp-bamboohr

BambooHR MCP Pack — wraps the BambooHR API v1

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `bamboohr_list_employees` | List employees from BambooHR. Returns a directory of all employees. |
| `bamboohr_get_employee` | Get details for a specific employee by ID. Specify which fields to retrieve. |
| `bamboohr_get_directory` | Get the employee directory from BambooHR with basic info for all employees. |
| `bamboohr_list_timeoff` | List time-off requests within a date range. |
| `bamboohr_get_employee_files` | Get a list of files associated with an employee. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "bamboohr": {
      "url": "https://gateway.pipeworx.io/bamboohr/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use bamboohr
```

## License

MIT
