import { spawn } from 'child_process';
import type blessed from 'blessed';
import type { Example, RunningProcess, AppState } from '../types.js';

export function createProcessRunner(
  outputBox: blessed.Widgets.Log,
  screen: blessed.Widgets.Screen,
  state: AppState,
  updateStatus: (message: string, color?: string) => void,
  updateInfoBox: (example: Example | null, isRunning?: boolean) => void,
  updateListWithRunningIndicator: () => void,
  examplesDir: string
) {
  function stopCurrentProcess(): void {
    if (state.currentProcess?.isRunning) {
      state.currentProcess.process.kill('SIGTERM');
      state.currentProcess.isRunning = false;
      setTimeout(() => {
        if (state.currentProcess && !state.currentProcess.process.killed) {
          state.currentProcess.process.kill('SIGKILL');
        }
      }, 2000);
      updateListWithRunningIndicator();
      if (state.selectedExample) {
        updateInfoBox(state.selectedExample, false);
      }
    }
  }

  function runExample(example: Example): void {
    stopCurrentProcess();
    outputBox.setContent('');
    
    const header = [
      `{bold}{cyan-fg}Starting: ${example.name}{/cyan-fg}{/bold}`,
      `{bold}{yellow-fg}Model: ${state.currentModel}{/yellow-fg}{/bold}`,
      `{gray-fg}${'─'.repeat(60)}{/gray-fg}`,
      ''
    ].join('\n');
    
    outputBox.log(header);
    updateStatus('Running...', 'yellow');
    updateInfoBox(example, true);

    const proc = spawn('npx', ['tsx', example.fullPath], {
      cwd: examplesDir,
      env: {
        ...process.env,
        CLAUDE_MODEL: state.currentModel
      }
    });

    state.currentProcess = {
      process: proc,
      outputLines: [],
      isRunning: true,
      exitCode: null,
      error: null,
      example
    };

    updateListWithRunningIndicator();

    proc.stdout.on('data', (data: Buffer) => {
      const text = data.toString();
      state.currentProcess!.outputLines.push(text);
      outputBox.log(text.trimEnd());
      screen.render();
    });

    proc.stderr.on('data', (data: Buffer) => {
      const text = data.toString();
      state.currentProcess!.outputLines.push(text);
      outputBox.log(`{red-fg}${text.trimEnd()}{/red-fg}`);
      screen.render();
    });

    proc.on('error', (error: Error) => {
      state.currentProcess!.error = error.message;
      state.currentProcess!.isRunning = false;
      outputBox.log(`\n{red-fg}{bold}Error:{/bold} ${error.message}{/red-fg}`);
      updateStatus('Error occurred', 'red');
      updateListWithRunningIndicator();
      updateInfoBox(example, false);
      screen.render();
    });

    proc.on('close', (code: number | null) => {
      if (!state.currentProcess) return;
      
      state.currentProcess.exitCode = code;
      state.currentProcess.isRunning = false;
      
      const footer = [
        '',
        `{gray-fg}${'─'.repeat(60)}{/gray-fg}`,
        code === 0 
          ? `{green-fg}{bold}✓{/bold} Completed successfully (exit code: ${code}){/green-fg}`
          : `{red-fg}{bold}✗{/bold} Exited with code: ${code}{/red-fg}`
      ].join('\n');
      
      outputBox.log(footer);
      updateStatus(
        code === 0 ? 'Completed successfully' : 'Failed', 
        code === 0 ? 'green' : 'red'
      );
      updateListWithRunningIndicator();
      updateInfoBox(example, false);
      screen.render();
    });
  }

  return { runExample, stopCurrentProcess };
}

