# SDK Guide Module

An interactive terminal-based guide for exploring the Claude Code SDK features and capabilities. Built with a modular architecture for maintainability and extensibility.

## Architecture

```
guide/
├── constants.ts          # Tool descriptions, categories, permission modes
├── types.ts             # TypeScript type definitions
├── utils.ts             # Utility functions (code highlighting)
├── state.ts             # Application state management
├── queries.ts           # Contextual query logic and result types
├── components.ts        # UI component factory functions
├── live-query.ts        # Live query execution logic
├── menu.ts              # Main entry point (129 lines)
├── handlers/            # Event handler modules
│   ├── index.ts         # Handler exports
│   ├── navigation.ts    # Left panel navigation logic
│   ├── scroll.ts        # Scroll handlers for panels
│   ├── focus.ts         # Tab/focus management
│   └── global.ts        # Global keyboard shortcuts
└── pages/               # Individual page content modules
    ├── index.ts         # Page exports
    ├── sdk.ts
    ├── getting-started.ts
    ├── available-tools.ts
    ├── models.ts
    ├── permission-modes.ts
    ├── configuration-options.ts
    ├── response-parsers.ts
    ├── fluent-api-methods.ts
    ├── session-features.ts
    ├── examples.ts
    ├── claude-code.ts
    ├── mcp-servers.ts
    ├── subagents.ts
    ├── skills.ts
    └── plugins.ts
```

## Core Modules

### Entry Point
- **menu.ts**: Application orchestration and initialization (129 lines)

### UI Layer
- **components.ts**: Factory functions for blessed UI components (title bar, panels, help bar)
- **state.ts**: Centralized application state (model selection, current section, query status)

### Event Handling
- **handlers/navigation.ts**: List navigation, parent section handling, keyboard shortcuts
- **handlers/scroll.ts**: Scroll event handlers for content panels
- **handlers/focus.ts**: Tab navigation and focus management
- **handlers/global.ts**: Global keyboard shortcuts (model switch, reload, quit)

### Content & Data
- **pages/**: Individual page modules returning structured content
- **constants.ts**: Static configuration (tool descriptions, categories, permission modes)
- **queries.ts**: Contextual query generation for live SDK interactions
- **types.ts**: TypeScript type definitions for type safety

### Features
- **live-query.ts**: Real-time SDK query execution with token usage and cost tracking
- **utils.ts**: Syntax highlighting with bordered code blocks

## Usage

```bash
npm run guide
```

Or directly:

```bash
npx tsx guide/index.ts
```

### Keyboard Shortcuts

| Key                 | Action                        |
| ------------------- | ----------------------------- |
| `↑/↓` or `j/k`      | Navigate sections             |
| `Enter`             | Select section                |
| `Home/End` or `g/G` | Jump to first/last section    |
| `PgUp/PgDn`         | Page navigation               |
| `Tab/Shift+Tab`     | Cycle focus between panels    |
| `l`                 | Run live SDK query            |
| `m`                 | Switch model (Haiku ↔ Sonnet) |
| `r`                 | Reload application            |
| `q` or `Ctrl+C`     | Quit                          |

## Design Principles

1. **Single Responsibility**: Each module handles one concern
2. **Separation of Concerns**: UI, events, state, and content are isolated
3. **Dependency Injection**: Handlers receive dependencies explicitly
4. **Type Safety**: Comprehensive TypeScript typing throughout
5. **Reusability**: Components and handlers are framework-agnostic
6. **Testability**: Pure functions and clear interfaces enable unit testing

## Module Responsibilities

### Components Layer
Creates and configures UI elements without business logic.

### Handlers Layer  
Processes user input and updates state/UI accordingly. Organized by responsibility:
- Navigation: List selection and movement
- Scroll: Content scrolling
- Focus: Panel focus management
- Global: Application-wide shortcuts

### State Layer
Single source of truth for application state with clear mutation points.

### Content Layer
Pure data functions that return formatted content for display.

## Extension Points

### Adding a New Page
1. Create `guide/pages/your-page.ts` with a getter function
2. Export from `guide/pages/index.ts`
3. Add to `buildSdkData()` in `menu.ts`

### Adding a Handler
1. Create handler module in `guide/handlers/`
2. Export from `guide/handlers/index.ts`
3. Register in `menu.ts` initialization

### Adding UI Components
1. Add factory function to `components.ts`
2. Import and initialize in `menu.ts`

## Technical Stack

- **UI Framework**: [blessed](https://github.com/chjj/blessed) - Terminal UI library
- **Syntax Highlighting**: [cli-highlight](https://github.com/felixfbecker/cli-highlight)
- **Runtime**: Node.js with TypeScript (ESM)
