import { readdir, stat, readFile } from 'fs/promises';
import { join, relative, dirname } from 'path';
import { toSentenceCase } from '../utils/string-utils.js';
import type { Example } from '../types.js';
import { EXCLUDED_DIRECTORIES, TRAIT_ICONS } from '../constants.js';

function getIconsForTraits(traits?: string[]): string {
  if (!traits || traits.length === 0) return '';

  return traits
    .map(trait => TRAIT_ICONS[trait.trim()] || '')
    .filter(icon => icon.length > 0)
    .join('');
}

async function getExampleDescription(
  filePath: string
): Promise<{ short: string; long: string; traits?: string[] }> {
  try {
    const content = await readFile(filePath, 'utf-8');

    let traits: string[] | undefined;
    const traitsMatch = content.match(/@traits\s+([^\n]+)/);
    if (traitsMatch) {
      traits = traitsMatch[1]
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }

    const multiLineMatch = content.match(/\/\*\*\s*\n((?:\s*\*.*\n)*)\s*\*\//);
    if (multiLineMatch) {
      const lines = multiLineMatch[1]
        .split('\n')
        .map(line => line.replace(/^\s*\*\s?/, '').trim())
        .filter(line => !line.startsWith('@traits'));

      const nonEmptyLines = lines.filter(line => line.length > 0);

      let emptyLineIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '' && i > 0 && lines[i - 1] !== '') {
          emptyLineIndex = i;
          break;
        }
      }

      if (emptyLineIndex > 0) {
        const shortLines = lines.slice(0, emptyLineIndex).filter(l => l.length > 0);
        const longLines = lines.slice(emptyLineIndex + 1).filter(l => l.length > 0);
        return {
          short: shortLines.join(' '),
          long: [...shortLines, '', ...longLines].join('\n'),
          traits
        };
      }

      const fullText = nonEmptyLines.join(' ');
      return { short: fullText, long: fullText, traits };
    }

    const commentMatch = content.match(/\/\*\*\s*\n\s*\*\s*(.+?)\n/);
    if (commentMatch) {
      const desc = commentMatch[1].trim();
      return { short: desc, long: desc, traits };
    }

    const singleCommentMatch = content.match(/\/\/\s*(.+?)\n/);
    if (singleCommentMatch) {
      const desc = singleCommentMatch[1].trim();
      return { short: desc, long: desc, traits };
    }
  } catch {}

  return {
    short: 'No description available',
    long: 'No description available'
  };
}

export async function findExamples(
  dir: string, 
  baseDir: string = dir
): Promise<Example[]> {
  const examples: Example[] = [];
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      if (EXCLUDED_DIRECTORIES.includes(entry)) continue;
      examples.push(...await findExamples(fullPath, baseDir));
    } else if (entry.endsWith('.ts') && entry !== 'menu.ts') {
      const relativePath = relative(baseDir, fullPath);
      const category = dirname(relativePath) === '.'
        ? 'Root Examples'
        : dirname(relativePath).split('/').map(p =>
            p.split('-').map(w =>
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ')
          ).join(' / ');

      const name = entry.replace('.ts', '');
      const descriptions = await getExampleDescription(fullPath);
      const icon = getIconsForTraits(descriptions.traits);

      examples.push({
        name,
        path: relativePath,
        category,
        description: descriptions.short,
        shortDescription: descriptions.short,
        longDescription: descriptions.long,
        fullPath,
        traits: descriptions.traits,
        icon
      });
    }
  }

  return examples;
}

export function groupByCategory(examples: Example[]): Map<string, Example[]> {
  const groups = new Map<string, Example[]>();
  
  for (const example of examples) {
    const existing = groups.get(example.category) || [];
    existing.push(example);
    groups.set(example.category, existing);
  }
  
  return groups;
}

export function buildSortedExamples(examples: Example[]): Example[] {
  const groups = groupByCategory(examples);
  const allExamples: Example[] = [];
  
  Array.from(groups.entries())
    .sort(([a], [b]) => {
      if (a === 'Root Examples') return -1;
      if (b === 'Root Examples') return 1;
      return a.localeCompare(b);
    })
    .forEach(([, exs]) => {
      allExamples.push(...exs.sort((a, b) => a.name.localeCompare(b.name)));
    });

  return allExamples;
}

export function buildListItems(
  examples: Example[]
): { items: string[]; itemToExample: Map<number, Example> } {
  let currentCategory = '';
  const items: string[] = [];
  const itemToExample = new Map<number, Example>();
  let itemIndex = 0;
  
  examples.forEach((example) => {
    if (example.category !== currentCategory) {
      items.push(`{bold}{cyan-fg}${example.category}{/cyan-fg}{/bold}`);
      itemIndex++;
      currentCategory = example.category;
    }
    const displayName = toSentenceCase(example.name);
    const iconSuffix = example.icon || '';

    const contentWidth = 30;
    const iconWidth = 4;
    const titleWidth = contentWidth - iconWidth - 2;

    let line = '  ';
    line += displayName.padEnd(titleWidth, ' ');
    line += iconSuffix.padStart(iconWidth, ' ');

    items.push(line);
    itemToExample.set(itemIndex, example);
    itemIndex++;
  });

  return { items, itemToExample };
}

