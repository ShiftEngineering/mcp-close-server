#!/bin/bash

# Exit on any error
set -e

echo "Setting up Close.com MCP Server..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js could not be found. Please install Node.js 17 or higher."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 17 ]; then
    echo "You need Node.js version 17 or higher. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "Created .env from .env.example template."
        echo "Please edit .env and add your Close.com API key."
    else
        echo "CLOSE_API_KEY=your_api_key_here" > .env
        echo "Created .env. Please edit and add your Close.com API key."
    fi
fi

echo "Setup complete!"
echo "To run the server, use: npm start"
echo "For development with auto-reload, use: npm run dev"
