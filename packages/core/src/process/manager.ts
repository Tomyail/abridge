import * as pty from '@skitee3000/bun-pty';
import * as os from 'os';
import { EventEmitter } from 'events';
import { Session } from './session';

export declare interface ProcessManager {
  on(event: 'change', listener: (sessions: Session[]) => void): this;
  emit(event: 'change', sessions: Session[]): boolean;
}

export class ProcessManager extends EventEmitter {
  private sessions: Map<string, Session> = new Map();

  constructor() {
    super();
  }

  spawn(command: string, args: string[], cwd: string = process.env.HOME || '/'): Session {
    // defaults
    const cols = 80;
    const rows = 24;

    const ptyProcess = pty.spawn(command, args, {
      name: 'xterm-256color',
      cols,
      rows,
      cwd,
      env: process.env as Record<string, string>
    });

    const session = new Session(ptyProcess, command, args);
    this.sessions.set(session.id, session);
    
    // Throttle updates implementation
    let pendingUpdate = false;
    const scheduleUpdate = () => {
        if (!pendingUpdate) {
            pendingUpdate = true;
            setTimeout(() => {
                pendingUpdate = false;
                this.emit('change', this.list());
            }, 100); // 10fps updates for preview
        }
    };

    // Listen for data to trigger updates
    session.onData(() => {
        scheduleUpdate();
    });

    // Listen for session exit to update list
    session.pty.onExit(() => {
        this.emit('change', this.list());
    });

    this.emit('change', this.list());
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  list(): Session[] {
    return Array.from(this.sessions.values());
  }

  kill(id: string) {
    const session = this.sessions.get(id);
    if (session) {
      session.pty.kill();
      this.sessions.delete(id);
      this.emit('change', this.list());
    }
  }
}

export const processManager = new ProcessManager();
