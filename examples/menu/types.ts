import type { ChildProcess } from 'child_process';

export type Example = {
  name: string;
  path: string;
  category: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  fullPath: string;
  traits?: string[];
  icon?: string;
};

export type RunningProcess = {
  process: ChildProcess;
  outputLines: string[];
  isRunning: boolean;
  exitCode: number | null;
  error: string | null;
  example: Example;
};

export type BlessedList = {
  selected: number;
  down(): void;
  up(): void;
  select(index: number): void;
};

export type AppState = {
  currentProcess: RunningProcess | null;
  selectedExample: Example | null;
  lastClickedExample: Example | null;
  lastClickTime: number;
  isDescriptionExpanded: boolean;
  currentModel: 'haiku' | 'sonnet';
};

