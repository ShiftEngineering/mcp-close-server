#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CloseClient } from "./closeClient.js";
import { 
  formatLead, 
  formatContact, 
  formatLeadSearchResults, 
  formatContactSearchResults,
  formatEmail,
  formatEmailSearchResults,
  formatTask,
  formatTaskSearchResults
} from "./formatter.js";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env file if it exists
try {
  const envPath = join(process.cwd(), '.env');
  const envConfig = readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map(part => part.trim()));
  
  for (const [key, value] of envConfig) {
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
} catch (error) {
  // .env file not found or cannot be read, continue
  console.error("Note: No .env file loaded");
}

// Get API key from environment variables
const CLOSE_API_KEY = process.env.CLOSE_API_KEY;

if (!CLOSE_API_KEY) {
  console.error("Error: CLOSE_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize Close API client
const closeClient = new CloseClient(CLOSE_API_KEY);

// Create server instance
const server = new McpServer({
  name: "close-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: {
      listChanged: true
    },
    logging: {}
  },
});

// Search Leads Tool
server.tool(
  "search_leads",
  "Search for leads in Close.com",
  {
    query: z.string().describe("Search query string (e.g., company name, contact, etc.)"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
  },
  async ({ query, limit = 10 }) => {
    try {
      const results = await closeClient.searchLeads(query, limit);
      const formattedResults = formatLeadSearchResults(results);
      
      return {
        content: [
          {
            type: "text",
            text: formattedResults
          }
        ]
      };
    } catch (error) {
      console.error("Error searching leads:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching leads: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Get Lead Details Tool
server.tool(
  "get_lead_details",
  "Get detailed information about a specific lead",
  {
    lead_id: z.string().describe("The ID of the lead to retrieve"),
  },
  async ({ lead_id }) => {
    try {
      const lead = await closeClient.getLeadById(lead_id);
      const formattedLead = formatLead(lead);
      
      return {
        content: [
          {
            type: "text",
            text: formattedLead
          }
        ]
      };
    } catch (error) {
      console.error("Error getting lead details:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error getting lead details: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Search Contacts Tool
server.tool(
  "search_contacts",
  "Search for contacts in Close.com",
  {
    query: z.string().describe("Search query string (e.g., name, email, etc.)"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
  },
  async ({ query, limit = 10 }) => {
    try {
      const results = await closeClient.searchContacts(query, limit);
      const formattedResults = formatContactSearchResults(results);
      
      return {
        content: [
          {
            type: "text",
            text: formattedResults
          }
        ]
      };
    } catch (error) {
      console.error("Error searching contacts:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching contacts: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Get Contact Details Tool
server.tool(
  "get_contact_details",
  "Get detailed information about a specific contact",
  {
    contact_id: z.string().describe("The ID of the contact to retrieve"),
  },
  async ({ contact_id }) => {
    try {
      const contact = await closeClient.getContactById(contact_id);
      const formattedContact = formatContact(contact);
      
      return {
        content: [
          {
            type: "text",
            text: formattedContact
          }
        ]
      };
    } catch (error) {
      console.error("Error getting contact details:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error getting contact details: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Test connection to Close.com API
server.tool(
  "test_connection",
  "Test the connection to Close.com API",
  {},
  async () => {
    try {
      const isConnected = await closeClient.testConnection();
      
      if (isConnected) {
        return {
          content: [
            {
              type: "text",
              text: "Successfully connected to Close.com API"
            }
          ]
        };
      } else {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Failed to connect to Close.com API"
            }
          ]
        };
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error testing connection: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Search Email Activities Tool
server.tool(
  "search_emails",
  "Search for email activities in Close.com",
  {
    lead_id: z.string().optional().describe("Filter by lead ID"),
    user_id: z.string().optional().describe("Filter by user ID"),
    date_created__gt: z.string().optional().describe("Filter by date created after (ISO format)"),
    date_created__lt: z.string().optional().describe("Filter by date created before (ISO format)"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
  },
  async ({ lead_id, user_id, date_created__gt, date_created__lt, limit = 10 }) => {
    try {
      const results = await closeClient.searchEmails({
        lead_id,
        user_id,
        date_created__gt,
        date_created__lt,
        limit,
      });
      const formattedResults = formatEmailSearchResults(results);
      
      return {
        content: [
          {
            type: "text",
            text: formattedResults
          }
        ]
      };
    } catch (error) {
      console.error("Error searching email activities:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching email activities: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Get Email Activity Details Tool
server.tool(
  "get_email_details",
  "Get detailed information about a specific email activity",
  {
    email_id: z.string().describe("The ID of the email activity to retrieve"),
  },
  async ({ email_id }) => {
    try {
      const email = await closeClient.getEmailById(email_id);
      const formattedEmail = formatEmail(email);
      
      return {
        content: [
          {
            type: "text",
            text: formattedEmail
          }
        ]
      };
    } catch (error) {
      console.error("Error getting email details:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error getting email details: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Search Tasks Tool
server.tool(
  "search_tasks",
  "Search for tasks in Close.com",
  {
    id: z.string().optional().describe("Filter by task ID"),
    id__in: z.array(z.string()).optional().describe("Filter by multiple task IDs"),
    _type: z.string().optional().describe("Filter by task type"),
    lead_id: z.string().optional().describe("Filter by lead ID"),
    is_complete: z.boolean().optional().describe("Filter by completion status"),
    date__lt: z.string().optional().describe("Filter by date before (ISO format)"),
    date__gt: z.string().optional().describe("Filter by date after (ISO format)"),
    date__lte: z.string().optional().describe("Filter by date before or equal (ISO format)"),
    date__gte: z.string().optional().describe("Filter by date after or equal (ISO format)"),
    date_created__lt: z.string().optional().describe("Filter by creation date before (ISO format)"),
    date_created__gt: z.string().optional().describe("Filter by creation date after (ISO format)"),
    date_created__lte: z.string().optional().describe("Filter by creation date before or equal (ISO format)"),
    date_created__gte: z.string().optional().describe("Filter by creation date after or equal (ISO format)"),
    assigned_to: z.string().optional().describe("Filter by assigned user ID"),
    view: z.enum(['inbox', 'future', 'archive']).optional().describe("Filter by view type"),
    _order_by: z.string().optional().describe("Order by field (e.g., 'date' or '-date')"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
  },
  async (params) => {
    try {
      const results = await closeClient.searchTasks(params);
      const formattedResults = formatTaskSearchResults(results);
      
      return {
        content: [
          {
            type: "text",
            text: formattedResults
          }
        ]
      };
    } catch (error) {
      console.error("Error searching tasks:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error searching tasks: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Get Task Details Tool
server.tool(
  "get_task_details",
  "Get detailed information about a specific task",
  {
    task_id: z.string().describe("The ID of the task to retrieve"),
  },
  async ({ task_id }) => {
    try {
      const task = await closeClient.getTaskById(task_id);
      const formattedTask = formatTask(task);
      
      return {
        content: [
          {
            type: "text",
            text: formattedTask
          }
        ]
      };
    } catch (error) {
      console.error("Error getting task details:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error getting task details: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Create Task Tool
server.tool(
  "create_task",
  "Create a new task in Close.com",
  {
    lead_id: z.string().describe("The ID of the lead to create the task for"),
    text: z.string().describe("The task description"),
    date: z.string().describe("The task date (ISO format)"),
    assigned_to: z.string().optional().describe("The ID of the user to assign the task to"),
  },
  async ({ lead_id, text, date, assigned_to }) => {
    try {
      const task = await closeClient.createTask({
        lead_id,
        text,
        date,
        assigned_to,
      });
      const formattedTask = formatTask(task);
      
      return {
        content: [
          {
            type: "text",
            text: `Task created successfully:\n${formattedTask}`
          }
        ]
      };
    } catch (error) {
      console.error("Error creating task:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error creating task: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Update Task Tool
server.tool(
  "update_task",
  "Update an existing task in Close.com",
  {
    task_id: z.string().describe("The ID of the task to update"),
    assigned_to: z.string().optional().describe("The ID of the user to assign the task to"),
    date: z.string().optional().describe("The new task date (ISO format)"),
    is_complete: z.boolean().optional().describe("Whether the task is complete"),
    text: z.string().optional().describe("The new task description"),
  },
  async ({ task_id, ...data }) => {
    try {
      const task = await closeClient.updateTask(task_id, data);
      const formattedTask = formatTask(task);
      
      return {
        content: [
          {
            type: "text",
            text: `Task updated successfully:\n${formattedTask}`
          }
        ]
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error updating task: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// Delete Task Tool
server.tool(
  "delete_task",
  "Delete a task in Close.com",
  {
    task_id: z.string().describe("The ID of the task to delete"),
  },
  async ({ task_id }) => {
    try {
      await closeClient.deleteTask(task_id);
      
      return {
        content: [
          {
            type: "text",
            text: `Task ${task_id} deleted successfully`
          }
        ]
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Error deleting task: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Close.com MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
