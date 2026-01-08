import { Socket, createConnection } from 'net';
import { EventEmitter } from 'events';
import { type SerializedSession, type IPCMessage } from './protocol';
import { spawn } from 'child_process';
import { join } from 'path';

const SOCKET_PATH = process.env.ABRIDGE_SOCK || (process.platform === 'win32'
  ? '\\\\.\\pipe\\abridge'
  : '/tmp/abridge.sock');

export class DaemonClient extends EventEmitter {
  private socket: Socket | null = null;
  private requestId = 0;
  private pendingRequests = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();

  constructor() {
    super();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            const socket = createConnection(SOCKET_PATH);
            
            socket.on('connect', () => {
                this.socket = socket;
                this.setupSocket(socket);
                resolve();
            });

            socket.on('error', (err: any) => {
                // ENOENT/ECONNREFUSED means daemon not running
                if (err.code === 'ENOENT' || err.code === 'ECONNREFUSED') {
                    this.spawnDaemon().then(() => {
                        // Wait a bit for daemon to start listening
                        setTimeout(() => {
                            const retry = createConnection(SOCKET_PATH);
                             retry.on('connect', () => {
                                 this.socket = retry;
                                 this.setupSocket(retry);
                                 resolve();
                             });
                             retry.on('error', reject);
                        }, 500);
                    }).catch(reject);
                } else {
                    reject(err);
                }
            });
        };
        tryConnect();
    });
  }

  private spawnDaemon() {
      // We assume we are running in a monorepo or installed package context
      // simplest way: spawn 'abridge daemon' command
      // BUT for dev: we might need to spawn 'bun packages/cli/src/daemon-entry.ts' ?
      // Let's assume 'abridge' executable is available or we spawn current node process.
      
      return new Promise<void>((resolve, reject) => {
          // For now, let's try to assume 'abridge' is in path, or use process.argv[0] if it looks like the binary
          // Actually, in dev environment (bun), we need to run the daemon script.
          // This logic might need refinement for Dev vs Prod.
          
          const subprocess = spawn(process.argv[0], [process.argv[1], 'daemon'], {
              detached: true,
              stdio: 'ignore',
              env: process.env
          });
          
          subprocess.unref();
          resolve(); 
      });
  }

  private setupSocket(sock: Socket) {
      // Line-based JSON framing
      let buffer = '';
      sock.on('data', (data) => {
          buffer += data.toString();
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep partial line
          
          for (const line of lines) {
              if (line.trim()) {
                  this.handleMessage(JSON.parse(line));
              }
          }
      });
      
      sock.on('close', () => {
          this.emit('disconnect');
          this.socket = null;
      });
  }

  private handleMessage(msg: IPCMessage) {
      if (msg.id !== undefined && this.pendingRequests.has(msg.id)) {
          const { resolve, reject } = this.pendingRequests.get(msg.id)!;
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
          this.pendingRequests.delete(msg.id);
      } else if (msg.method === 'change') {
          // Broadcast event
          this.emit('change', msg.params.sessions);
      }
  }

  private request(method: string, params: any): Promise<any> {
      if (!this.socket) throw new Error('Not connected');
      const id = ++this.requestId;
      return new Promise((resolve, reject) => {
          this.pendingRequests.set(id, { resolve, reject });
          this.socket!.write(JSON.stringify({ id, method, params }) + '\n');
      });
  }

  // --- ProcessManager Compatible API ---

  async spawn(command: string, args: string[], cwd: string) {
      const res = await this.request('spawn', { command, args, cwd });
      return res; // returns { id }
  }

  async list(): Promise<SerializedSession[]> {
      return this.request('list', {});
  }

  async kill(id: string) {
      return this.request('kill', { id });
  }

  /**
   * Connects to a specific session's PTY stream.
   * Returns a raw Socket that is piped to the PTY.
   */
  async attach(id: string): Promise<Socket> {
      return new Promise((resolve, reject) => {
          const socket = createConnection(SOCKET_PATH);
          socket.on('connect', () => {
              // Send Attach Handshake
              socket.write(`ATTACH ${id}\n`);
              resolve(socket);
          });
          socket.on('error', reject);
      });
  }
}
