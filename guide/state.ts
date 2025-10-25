export type AppState = {
  currentModel: 'haiku' | 'sonnet';
  currentSection: string;
  isQueryRunning: boolean;
};

export function createAppState(): AppState {
  return {
    currentModel: 'haiku',
    currentSection: 'Getting Started',
    isQueryRunning: false
  };
}
