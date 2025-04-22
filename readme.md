# Close.com MCP Server

An MCP (Model Context Protocol) server that connects to Close.com API, allowing AI assistants to search and retrieve lead and contact information.

## Features

- Search for leads in Close.com
- Retrieve detailed lead information
- Search for contacts in Close.com
- Retrieve detailed contact information
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

### test_connection

Test the connection to Close.com API.

No parameters required.

## Security

This server only performs read-only operations on your Close.com account. The API key should be kept secure and not shared.

## License

MIT
