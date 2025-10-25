import { claude } from '../dist/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

/**
 * Comprehensive examples of new Claude Code SDK features
 *
 * This demo showcases advanced features including:
 * 1. MCP Server-Level Permission Management - Control access to MCP servers
 * 2. Configuration File Support - Load settings from external config files
 * 3. Roles/Personas System - Define and switch between different AI personas
 *
 * @traits config
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Example 1: MCP Server-Level Permissions
async function mcpPermissionsExample() {
  console.log('=== MCP Server-Level Permissions Example ===\n');
  console.log('Note: MCP server permissions require configured MCP servers');
  console.log('Example structure:\n');
  
  console.log('Simple MCP server permission:');
  console.log(`  claude()
    .withMCPServerPermission('file-system-mcp', 'whitelist')
    .withMCPServerPermission('database-mcp', 'ask')
    .query('Your task here')
`);

  console.log('Bulk MCP server permissions:');
  console.log(`  claude()
    .withMCPServerPermissions({
      'file-system-mcp': 'whitelist',
      'git-mcp': 'whitelist',
      'database-mcp': 'blacklist'
    })
    .query('Your task here')
`);
  
  // Demo without actual MCP servers - just show the API works
  const response = await claude()
    .skipPermissions()
    .query('Say hello')
    .asText();
    
  console.log('Basic query (without MCP):', response);
}

// Example 2: Configuration File Support
async function configFileExample() {
  console.log('\n=== Configuration File Example ===\n');

  // First, let's create a sample config file
  const sampleConfig = {
    version: '1.0',
    globalSettings: {
      model: 'opus',
      timeout: 60000,
      permissionMode: 'acceptEdits',
      defaultToolPermission: 'ask'
    },
    mcpServers: {
      'file-system-mcp': {
        defaultPermission: 'allow',
        tools: {
          'Read': 'allow',
          'Write': 'deny',
          'Edit': 'ask'
        }
      },
      'database-mcp': {
        defaultPermission: 'deny',
        tools: {
          'Query': 'ask'
        }
      }
    },
    tools: {
      allowed: ['Read', 'Grep', 'LS'],
      denied: ['Bash', 'WebSearch']
    }
  };

  console.log('Sample config:', JSON.stringify(sampleConfig, null, 2));

  // Load config from file (commented out - requires actual config)
  console.log('Loading from config file:');
  console.log(`  claude()
    .withConfigFile('./config/json/mcpconfig.json')
    .query('Your task')
`);

  // Use inline configuration (simplified without MCP servers)
  const simpleConfig = {
    version: '1.0' as const,
    globalSettings: {
      model: 'sonnet' as const,
      timeout: 30000,
      permissionMode: 'bypassPermissions' as const
    }
  };
  
  const response = await claude()
    .withConfig(simpleConfig)
    .query('Say hello and confirm you received the configuration')
    .asText();

  console.log('\nWith inline config:', response);
}

// Example 3: Roles/Personas System
async function rolesExample() {
  console.log('\n=== Roles/Personas Example ===\n');
  console.log('Roles allow you to define personas with specific permissions');
  console.log('and prompting templates:\n');
  
  console.log('Example role definition:');
  console.log(`const dataAnalystRole = {
  name: 'dataAnalyst',
  model: 'sonnet',
  permissions: {
    mode: 'bypassPermissions',
    tools: { allowed: ['Read'], denied: [] }
  },
  promptingTemplate: 'You are a \${domain} data analyst.',
  systemPrompt: 'Provide data-driven insights.',
  context: { maxTokens: 2000, temperature: 0.2 }
};
`);

  console.log('Use role with template variables:');
  console.log(`const response = await claude()
  .withRole(dataAnalystRole, { domain: 'financial' })
  .query('Your task')
  .asText();
`);
  
  console.log('\nOr load roles from a file:');
  console.log('await claude()');
  console.log('  .withRolesFile("./config/json/roles.json")');
  console.log('  .withRole("dataAnalyst")');
}

// Example 4: Combined Features
async function combinedFeaturesExample() {
  console.log('\n\n=== Combined Features Example ===\n');
  console.log('You can combine multiple features in a single query:\n');
  
  console.log('Example combining config, roles, and permissions:');
  console.log(`const response = await claude()
  .withConfig(config)              // Load global configuration
  .withRole(developerRole, vars)   // Apply role with variables
  .withMCPServerPermission(...)   // Set MCP permissions
  .allowTools('Read', 'Write')     // Tool-level permissions
  .debug(true)                     // Enable debugging
  .onToolUse(tool => log(tool))    // Add event handlers
  .query('Your task')
  .asText();
`);

  console.log('All features work together seamlessly!');
}

// Example 5: Role Inheritance
async function roleInheritanceExample() {
  console.log('\n\n=== Role Inheritance Example ===\n');
  
  console.log('Role inheritance allows roles to extend other roles:');
  console.log('Example structure in roles.yaml:');
  console.log(`
roles:
  baseAnalyst:
    model: sonnet
    permissions:
      tools:
        allowed: [Read, Grep]
        
  seniorAnalyst:
    extends: baseAnalyst  # Inherits from baseAnalyst
    model: opus           # Overrides parent model
    permissions:
      tools:
        allowed: [Write]  # Adds to parent's tools
`);
  
  console.log('Load with:');
  console.log('  await claude().withRolesFile("./config/yaml/roles.yaml")');
}

// Example 6: Error Handling
async function errorHandlingExample() {
  console.log('\n\n=== Error Handling Example ===\n');
  console.log('The SDK provides robust error handling:');
  console.log('- Invalid configuration values are caught');
  console.log('- Missing role definitions are detected');
  console.log('- File not found errors are clear');
  console.log('- Claude CLI errors are properly surfaced\n');
  console.log('Always wrap queries in try-catch blocks for');
  console.log('production code!');
}

// Run all examples
async function main() {
  try {
    await mcpPermissionsExample();
    await configFileExample();
    await rolesExample();
    await combinedFeaturesExample();
    await roleInheritanceExample();
    await errorHandlingExample();
  } catch (error) {
    console.error('Demo error:', error);
  }
}

main();