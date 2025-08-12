#!/bin/bash

# Fix the API key by removing the URL encoding character
echo "Fixing API key in .env file..."

# Create a backup
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Fix the API key by removing the % at the end
sed -i '' 's/NEXT_PRIVATE_API_KEY=460270c013d8ae740a3773d4916b017edd58b50a6a0fd9f651e8a5e1817d8fba%/NEXT_PRIVATE_API_KEY=460270c013d8ae740a3773d4916b017edd58b50a6a0fd9f651e8a5e1817d8fba/' .env

# Add the fallback environment variable
echo "STABLECOIN_API_KEY=460270c013d8ae740a3773d4916b017edd58b50a6a0fd9f651e8a5e1817d8fba" >> .env

echo "Environment file fixed! Please restart your development server." 