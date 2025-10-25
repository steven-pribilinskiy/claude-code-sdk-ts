import { highlight } from 'cli-highlight';

export function highlightCode(code: string): string {
  const highlighted = highlight(code, {
    language: 'typescript',
    theme: {
      keyword: (s: string) => `\x1b[32m${s}\x1b[0m`,
      built_in: (s: string) => `\x1b[36m${s}\x1b[0m`,
      string: (s: string) => `\x1b[33m${s}\x1b[0m`,
      comment: (s: string) => `\x1b[90m${s}\x1b[0m`,
      number: (s: string) => `\x1b[33m${s}\x1b[0m`,
      literal: (s: string) => `\x1b[36m${s}\x1b[0m`,
      function: (s: string) => `\x1b[36m${s}\x1b[0m`,
      params: (s: string) => `\x1b[37m${s}\x1b[0m`,
      attr: (s: string) => `\x1b[36m${s}\x1b[0m`
    }
  });

  const lines = highlighted.split('\n');
  const maxLen = Math.max(...lines.map(l => l.replace(/\x1b\[[0-9;]*m/g, '').length));
  
  const gray = '\x1b[90m';
  const reset = '\x1b[0m';
  
  const top = `${gray}╭${'─'.repeat(maxLen + 2)}╮${reset}`;
  const bottom = `${gray}╰${'─'.repeat(maxLen + 2)}╯${reset}`;
  
  const bordered = lines.map(line => {
    const stripped = line.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = ' '.repeat(maxLen - stripped.length);
    return `${gray}│${reset} ${line}${padding} ${gray}│${reset}`;
  });
  
  return `${top}\n${bordered.join('\n')}\n${bottom}`;
}

