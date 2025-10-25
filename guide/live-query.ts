import type blessed from 'blessed';
import { query } from '../dist/index.js';
import type { AppState } from './state.js';
import { getContextualQuery, type ResultMessage } from './queries.js';

export function createLiveQueryRunner(
  liveQueryBox: blessed.Widgets.BoxElement,
  screen: blessed.Widgets.Screen,
  state: AppState
): () => Promise<void> {
  return async function runLiveQuery(): Promise<void> {
    if (state.isQueryRunning) {
      liveQueryBox.setContent('{yellow-fg}Query already running...{/yellow-fg}');
      screen.render();
      return;
    }

    state.isQueryRunning = true;
    liveQueryBox.setLabel(' {bold}🟡 Live SDK Query - Running...{/bold} ');
    liveQueryBox.setContent('{yellow-fg}Querying Claude SDK...{/yellow-fg}\n');
    screen.render();

    try {
      const startTime = Date.now();
      let resultMessage: ResultMessage | null = null;
      let responseText = '';
      
      const contextualQuery = getContextualQuery(state.currentSection);
      for await (const message of query(
        contextualQuery,
        {
          model: state.currentModel,
          allowedTools: [],
          timeout: 10000
        }
      )) {
        if (message.type === 'result') {
          resultMessage = message;
        }
        if (message.type === 'assistant') {
          for (const block of message.content) {
            if (block.type === 'text') {
              responseText += block.text;
            }
          }
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      let output = '{green-fg}{bold}✓ Query Successful!{/bold}{/green-fg}\n\n';
      output += `{cyan-fg}Duration:{/cyan-fg} ${duration}ms\n\n`;
      
      if (resultMessage?.usage) {
        output += '{yellow-fg}{bold}Token Usage:{/bold}{/yellow-fg}\n';
        output += `  Input: ${resultMessage.usage.input_tokens || 0}\n`;
        output += `  Output: ${resultMessage.usage.output_tokens || 0}\n`;
        output += `  Cache Read: ${resultMessage.usage.cache_read_input_tokens || 0}\n`;
        output += `  Cache Creation: ${resultMessage.usage.cache_creation_input_tokens || 0}\n\n`;
      }

      if (resultMessage?.cost) {
        output += '{green-fg}{bold}Cost:{/bold}{/green-fg}\n';
        output += `  Input: $${(resultMessage.cost.input_cost || 0).toFixed(6)}\n`;
        output += `  Output: $${(resultMessage.cost.output_cost || 0).toFixed(6)}\n`;
        output += `  Cache Read: $${(resultMessage.cost.cache_read_cost || 0).toFixed(6)}\n`;
        output += `  Cache Write: $${(resultMessage.cost.cache_creation_cost || 0).toFixed(6)}\n`;
        output += `  {bold}Total: $${(resultMessage.cost.total_cost || 0).toFixed(6)}{/bold}\n\n`;
      }

      output += '{cyan-fg}{bold}Response:{/bold}{/cyan-fg}\n';
      output += `{gray-fg}${responseText || 'No response text'}{/gray-fg}`;

      liveQueryBox.setContent(output);
      liveQueryBox.setLabel(' {bold}🟢 Live SDK Query - Complete{/bold} ');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      liveQueryBox.setContent(`{red-fg}{bold}✗ Error:{/bold}\n${errorMsg}{/red-fg}`);
      liveQueryBox.setLabel(' {bold}🔴 Live SDK Query - Error{/bold} ');
    } finally {
      state.isQueryRunning = false;
      screen.render();
    }
  };
}

