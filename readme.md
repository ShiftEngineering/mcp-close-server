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
- Lead Management
  - Search leads with advanced filtering
  - Create, update, and delete leads
  - Get detailed lead information
  - Format lead data for easy reading
- Contact Management
  - Search contacts with advanced filtering
  - Create, update, and delete contacts
  - Get detailed contact information
  - Format contact data for easy reading
- Email Activity Management
  - Search email activities with advanced filtering
  - Create, update, and delete email activities
  - Get detailed email information
  - Format email data for easy reading
- Task Management
  - Search tasks with advanced filtering
  - Create, update, and delete tasks
  - Get detailed task information
  - Format task data for easy reading
- Opportunity Management
  - Search opportunities with advanced filtering
  - Create, update, and delete opportunities
  - Get detailed opportunity information
  - Format opportunity data for easy reading
  - Track opportunity values and confidence levels
  - Manage opportunity status and won dates

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

### Opportunity Tools

#### search_opportunities
Search for opportunities in Close.com with various filters.

Parameters:
- `lead_id` (optional): Filter by lead ID
- `user_id` (optional): Filter by user ID
- `status_id` (optional): Filter by status ID
- `status_label` (optional): Filter by status label
- `status_type` (optional): Filter by status type
- `date_created__lt` (optional): Filter by creation date before (ISO format)
- `date_created__gt` (optional): Filter by creation date after (ISO format)
- `date_created__lte` (optional): Filter by creation date before or equal (ISO format)
- `date_created__gte` (optional): Filter by creation date after or equal (ISO format)
- `date_updated__lt` (optional): Filter by update date before (ISO format)
- `date_updated__gt` (optional): Filter by update date after (ISO format)
- `date_updated__lte` (optional): Filter by update date before or equal (ISO format)
- `date_updated__gte` (optional): Filter by update date after or equal (ISO format)
- `date_won__lt` (optional): Filter by won date before (ISO format)
- `date_won__gt` (optional): Filter by won date after (ISO format)
- `date_won__lte` (optional): Filter by won date before or equal (ISO format)
- `date_won__gte` (optional): Filter by won date after or equal (ISO format)
- `value_period` (optional): Filter by value period (one_time/monthly/annual)
- `query` (optional): Search query filter
- `_order_by` (optional): Order by field (e.g., 'date_won' or '-date_won')
- `_group_by` (optional): Group by field (e.g., 'user_id' or 'date_won__month')
- `_fields` (optional): Fields to include in response
- `lead_saved_search_id` (optional): Filter by lead saved search ID
- `limit` (optional): Maximum number of results to return (default: 10)

#### get_opportunity_details
Get detailed information about a specific opportunity.

Parameters:
- `opportunity_id`: The ID of the opportunity to retrieve

#### create_opportunity
Create a new opportunity in Close.com.

Parameters:
- `lead_id` (optional): The ID of the lead to create the opportunity for
- `status_id` (optional): The ID of the status to set
- `value` (optional): The opportunity value
- `value_period` (optional): The value period (one_time/monthly/annual)
- `confidence` (optional): The confidence percentage (0-100)
- `note` (optional): Additional notes about the opportunity
- `custom` (optional): Custom fields to set

#### update_opportunity
Update an existing opportunity in Close.com.

Parameters:
- `opportunity_id`: The ID of the opportunity to update
- `status_id` (optional): The ID of the status to set
- `value` (optional): The opportunity value
- `value_period` (optional): The value period (one_time/monthly/annual)
- `confidence` (optional): The confidence percentage (0-100)
- `note` (optional): Additional notes about the opportunity
- `custom` (optional): Custom fields to set
- `date_won` (optional): The date when the opportunity was won (ISO format)

#### delete_opportunity
Delete an opportunity in Close.com.

Parameters:
- `opportunity_id`: The ID of the opportunity to delete

## Security

This server only performs read-only operations on your Close.com account. The API key should be kept secure and not shared.

## License

MIT
