# Close.com MCP Server

An MCP (Model Context Protocol) server that connects to Close.com API, allowing AI assistants to search and retrieve lead and contact information.

## Features

- Search for leads in Close.com
- Retrieve detailed lead information
- Search for contacts in Close.com
- Retrieve detailed contact information
- Search for emails
- Retrieve emails
- Search for tasks
- Create, update, and delete tasks
- Test connection to Close.com API

## Prerequisites

- Node.js 17 or higher
- Close.com API key
- An MCP client (like Claude Desktop)

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mcp-close-server.git
   cd mcp-close-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### Running the server directly

Make sure to set your Close.com API key as an environment variable:

```bash
export CLOSE_API_KEY="your_api_key_here"
npm start
```

### Using with Claude Desktop

1. Build the project as described above
2. Configure Claude Desktop to use this server by editing your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "close": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-close-server/build/index.js"
      ],
      "env": {
        "CLOSE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

3. Restart Claude Desktop

### Example Queries

After setting up the server with Claude Desktop, you can ask Claude questions like:

- "Can you search for leads related to Acme Corp?"
- "Find any contacts named John Smith"
- "Get details for lead with ID lead_abc123"
- "Search for leads in the Technology sector"
- "Find contacts with email addresses from google.com domain"
- "Can you check if our Close.com API connection is working?"

## Available Tools

### search_leads

Search for leads in Close.com.

Parameters:
- `query` (string): Search query string (e.g., company name, contact, etc.)
- `limit` (number, optional): Maximum number of results to return (default: 10)

### get_lead_details

Get detailed information about a specific lead.

Parameters:
- `lead_id` (string): The ID of the lead to retrieve

### search_contacts

Search for contacts in Close.com.

Parameters:
- `query` (string): Search query string (e.g., name, email, etc.)
- `limit` (number, optional): Maximum number of results to return (default: 10)

### get_contact_details

Get detailed information about a specific contact.

Parameters:
- `contact_id` (string): The ID of the contact to retrieve

### search_tasks

Search for tasks in Close.com.

Parameters:
- `id` (string, optional): Filter by task ID
- `id__in` (string[], optional): Filter by multiple task IDs
- `_type` (string, optional): Filter by task type
- `lead_id` (string, optional): Filter by lead ID
- `is_complete` (boolean, optional): Filter by completion status
- `date__lt` (string, optional): Filter by date before (ISO format)
- `date__gt` (string, optional): Filter by date after (ISO format)
- `date__lte` (string, optional): Filter by date before or equal (ISO format)
- `date__gte` (string, optional): Filter by date after or equal (ISO format)
- `date_created__lt` (string, optional): Filter by creation date before (ISO format)
- `date_created__gt` (string, optional): Filter by creation date after (ISO format)
- `date_created__lte` (string, optional): Filter by creation date before or equal (ISO format)
- `date_created__gte` (string, optional): Filter by creation date after or equal (ISO format)
- `assigned_to` (string, optional): Filter by assigned user ID
- `view` (enum, optional): Filter by view type ('inbox', 'future', 'archive')
- `_order_by` (string, optional): Order by field (e.g., 'date' or '-date')
- `limit` (number, optional): Maximum number of results to return (default: 10)

### get_task_details

Get detailed information about a specific task.

Parameters:
- `task_id` (string): The ID of the task to retrieve

### create_task

Create a new task in Close.com.

Parameters:
- `lead_id` (string): The ID of the lead to create the task for
- `text` (string): The task description
- `date` (string): The task date (ISO format)
- `assigned_to` (string, optional): The ID of the user to assign the task to

### update_task

Update an existing task in Close.com.

Parameters:
- `task_id` (string): The ID of the task to update
- `assigned_to` (string, optional): The ID of the user to assign the task to
- `date` (string, optional): The new task date (ISO format)
- `is_complete` (boolean, optional): Whether the task is complete
- `text` (string, optional): The new task description

### delete_task

Delete a task in Close.com.

Parameters:
- `task_id` (string): The ID of the task to delete

### test_connection

Test the connection to Close.com API.

No parameters required.

## Security

This server only performs read-only operations on your Close.com account. The API key should be kept secure and not shared.

## License

MIT
