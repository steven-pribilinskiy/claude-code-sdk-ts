# Examples Menu Module

Interactive terminal-based menu for discovering and running Claude Code SDK examples. Built with a modular architecture for maintainability.

## Architecture

```
menu/
├── index.ts              # Main entry point (122 lines)
├── types.ts             # TypeScript type definitions
├── constants.ts         # UI dimensions, icons, exclusions
├── state.ts             # Application state factory
├── components/          # UI component factories
│   ├── index.ts
│   └── ui-elements.ts   # Blessed UI components
├── handlers/            # Event handling modules
│   ├── index.ts
│   ├── list-handlers.ts      # List navigation and selection
│   ├── focus-handlers.ts     # Tab navigation
│   └── global-handlers.ts    # Global keyboard shortcuts
└── lib/                 # Business logic modules
    ├── index.ts
    ├── example-discovery.ts  # File discovery and categorization
    ├── process-runner.ts     # Example execution management
    └── ui-updates.ts         # UI state update functions
```

## Core Modules

### Entry Point
- **index.ts**: Application initialization and orchestration (122 lines)

### UI Layer
- **components/ui-elements.ts**: Factory functions for blessed UI components
- **state.ts**: Centralized application state factory

### Event Handling
- **handlers/list-handlers.ts**: List selection, navigation, double-click detection
- **handlers/focus-handlers.ts**: Tab/Shift-Tab focus cycling between panels
- **handlers/global-handlers.ts**: Global shortcuts (run, stop, copy, model switch, etc.)

### Business Logic
- **lib/example-discovery.ts**: Discovers .ts files, extracts metadata, groups by category
- **lib/process-runner.ts**: Spawns child processes, captures output, manages lifecycle
- **lib/ui-updates.ts**: Updates info box, status bar, running indicators

## Usage

```bash
npm run examples
```

Or directly:

```bash
npx tsx examples/menu/index.ts
```

### Keyboard Shortcuts

| Key                | Action                               |
| ------------------ | ------------------------------------ |
| `↑/↓` or `j/k`     | Navigate examples                    |
| `Enter` or `Space` | Run selected example                 |
| `r`                | Restart last run example             |
| `s`                | Stop running process                 |
| `c`                | Clear output                         |
| `d`                | Expand/collapse description          |
| `m`                | Switch model (Haiku ↔ Sonnet)        |
| `y`                | Copy output to clipboard             |
| `Tab/Shift+Tab`    | Cycle focus between list/info/output |
| `q` or `Ctrl+C`    | Quit application                     |

### Double-Click

Double-click on an example (click twice within 500ms) to execute it immediately.

## Example Metadata

Examples can include JSDoc comments with metadata:

```typescript
/**
 * Short description shown in collapsed view
 *
 * Long description with additional details shown when expanded.
 * Can span multiple lines.
 *
 * @traits interactive, streaming, requires-args
 */
```

### Supported Traits

- `interactive` 💬 - Example requires user input
- `requires-args` ⚙️ - Example expects command-line arguments
- `streaming` 📡 - Example uses streaming responses
- `config` 📄 - Example requires configuration file

## Design Principles

1. **Single Responsibility**: Each module handles one concern
2. **Dependency Injection**: Functions receive dependencies explicitly
3. **Type Safety**: Comprehensive TypeScript typing
4. **Separation of Concerns**: UI, events, state, and logic are isolated
5. **Testability**: Pure functions enable unit testing

## Module Responsibilities

### Components Layer
Creates blessed UI elements without business logic.

### Handlers Layer  
Processes user input and delegates to appropriate functions.

### Lib Layer
Core business logic:
- **example-discovery**: File system operations, metadata extraction
- **process-runner**: Child process management, output capture
- **ui-updates**: UI state mutations

### State Layer
Single source of truth with clear mutation boundaries.

## Extension Points

### Adding UI Components
1. Add factory function to `components/ui-elements.ts`
2. Import and initialize in `index.ts`

### Adding Handlers
1. Create handler module in `handlers/`
2. Export from `handlers/index.ts`
3. Register in `index.ts`

### Customizing Discovery
Modify `lib/example-discovery.ts`:
- Change excluded directories in `constants.ts`
- Add new trait icons
- Customize category naming

## Technical Stack

- **UI Framework**: [blessed](https://github.com/chjj/blessed)
- **Process Management**: Node.js `child_process`
- **Runtime**: Node.js with TypeScript (ESM)

