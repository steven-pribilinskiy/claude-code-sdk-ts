export function toSentenceCase(kebabCase: string): string {
  const acronyms = new Set([
    'sdk', 'yaml', 'api', 'cli', 'mcp', 'ui', 'crud', 'json', 'rest', 
    'otel', 'esm', 'cjs', 'jwt', 'oauth', 'wasm'
  ]);

  return kebabCase
    .split('-')
    .map(word => {
      if (acronyms.has(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

