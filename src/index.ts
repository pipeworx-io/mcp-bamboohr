interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * BambooHR MCP Pack — wraps the BambooHR API v1
 *
 * BYO key: _apiKey + _subdomain.
 * Auth: Basic auth with apiKey as username, "x" as password.
 * Accept: application/json header on all requests.
 * Tools: list/get employees, get directory, list time off, get employee files.
 */


function apiBase(subdomain: string): string {
  return `https://api.bamboohr.com/api/gateway.php/${subdomain}/v1`;
}

async function bhrFetch(apiKey: string, subdomain: string, path: string): Promise<unknown> {
  const credentials = btoa(`${apiKey}:x`);
  const res = await fetch(`${apiBase(subdomain)}${path}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`BambooHR API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'bamboohr_list_employees',
    description: 'List employees from BambooHR. Returns a directory of all employees.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'BambooHR API key' },
        _subdomain: { type: 'string', description: 'BambooHR subdomain (e.g., "mycompany" from mycompany.bamboohr.com)' },
      },
      required: ['_apiKey', '_subdomain'],
    },
  },
  {
    name: 'bamboohr_get_employee',
    description: 'Get details for a specific employee by ID. Specify which fields to retrieve.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'BambooHR API key' },
        _subdomain: { type: 'string', description: 'BambooHR subdomain' },
        id: { type: 'number', description: 'Employee ID' },
        fields: { type: 'string', description: 'Comma-separated field names (e.g., "firstName,lastName,department,jobTitle,workEmail")' },
      },
      required: ['_apiKey', '_subdomain', 'id', 'fields'],
    },
  },
  {
    name: 'bamboohr_get_directory',
    description: 'Get the employee directory from BambooHR with basic info for all employees.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'BambooHR API key' },
        _subdomain: { type: 'string', description: 'BambooHR subdomain' },
      },
      required: ['_apiKey', '_subdomain'],
    },
  },
  {
    name: 'bamboohr_list_timeoff',
    description: 'List time-off requests within a date range.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'BambooHR API key' },
        _subdomain: { type: 'string', description: 'BambooHR subdomain' },
        start: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        end: { type: 'string', description: 'End date (YYYY-MM-DD)' },
      },
      required: ['_apiKey', '_subdomain', 'start', 'end'],
    },
  },
  {
    name: 'bamboohr_get_employee_files',
    description: 'Get a list of files associated with an employee.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'BambooHR API key' },
        _subdomain: { type: 'string', description: 'BambooHR subdomain' },
        id: { type: 'number', description: 'Employee ID' },
      },
      required: ['_apiKey', '_subdomain', 'id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string;
  const subdomain = args._subdomain as string;

  switch (name) {
    case 'bamboohr_list_employees': {
      return bhrFetch(apiKey, subdomain, '/employees/directory');
    }

    case 'bamboohr_get_employee': {
      const id = args.id as number;
      const fields = args.fields as string;
      return bhrFetch(apiKey, subdomain, `/employees/${id}?fields=${encodeURIComponent(fields)}`);
    }

    case 'bamboohr_get_directory': {
      return bhrFetch(apiKey, subdomain, '/employees/directory');
    }

    case 'bamboohr_list_timeoff': {
      const start = args.start as string;
      const end = args.end as string;
      return bhrFetch(apiKey, subdomain, `/time_off/requests?start=${start}&end=${end}&status=approved`);
    }

    case 'bamboohr_get_employee_files': {
      const id = args.id as number;
      return bhrFetch(apiKey, subdomain, `/employees/${id}/files/view`);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
