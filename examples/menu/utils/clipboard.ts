import { exec } from 'child_process';

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    const commands = [
      'xclip -selection clipboard',
      'xsel --clipboard',
      'pbcopy',
      'clip.exe'
    ];
    
    for (const cmd of commands) {
      try {
        const proc = exec(cmd);
        if (proc.stdin) {
          proc.stdin.write(text);
          proc.stdin.end();
          await new Promise((resolve, reject) => {
            proc.on('close', (code) => code === 0 ? resolve(null) : reject());
            proc.on('error', reject);
          });
          return true;
        }
      } catch {
        continue;
      }
    }
    return false;
  } catch {
    return false;
  }
}

