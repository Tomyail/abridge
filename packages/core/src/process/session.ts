import { Terminal } from '@xterm/headless';
import type { IPty } from '@skitee3000/bun-pty';
import { v4 as uuidv4 } from 'uuid';

export type ProcessStatus = 'idle' | 'running' | 'error';

export interface ProcessMetadata {
  title: string;
  command: string;
  args: string[];
  status: ProcessStatus;
  startTime: number;
}

export class Session {
  public id: string;
  public metadata: ProcessMetadata;
  public pty: IPty;
  
  // Headless terminal to maintain state
  private term: Terminal;

  constructor(pty: IPty, readonly command: string, readonly args: string[]) {
    this.id = uuidv4();
    this.pty = pty;
    this.metadata = {
      title: command,
      command,
      args,
      status: 'running',
      startTime: Date.now()
    };

    // Initialize headless terminal
    this.term = new Terminal({
      allowProposedApi: true,
      cols: pty.cols,
      rows: pty.rows,
      scrollback: 1000
    });
    
    // Hook into data flow
    this.pty.onData((data) => {
      this.term.write(data);
    });

    this.pty.onExit(() => {
      this.metadata.status = 'idle';
    });
  }

  write(data: string) {
    this.pty.write(data);
  }

  resize(cols: number, rows: number) {
    this.pty.resize(cols, rows);
    this.term.resize(cols, rows);
  }

  onData(listener: (data: string) => void) {
    return this.pty.onData(listener);
  }

  getOutput(): string {
    // Simplified rendering for Inactive/Detached state.
    // We scrape the text content line-by-line, discarding colors and cursor moves.
    // This ensures rock-solid layout in the sidebar/preview pane.
    const buffer = this.term.buffer.active;
    const lines: string[] = [];
    
    // Iterate over the viewport rows
    for (let i = 0; i < this.term.rows; i++) {
        const line = buffer.getLine(i);
        if (line) {
            // translateToString(true) trims right whitespace
            lines.push(line.translateToString(true)); 
        } else {
            lines.push('');
        }
    }
    return lines.join('\n');
  }
}
