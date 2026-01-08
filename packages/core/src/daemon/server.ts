import { createServer, type Socket } from 'net';
import { processManager } from '../process/manager';
import type { Session } from '../process/session';
import { join } from 'path';
import { rmSync, ensureDirSync } from 'fs-extra';
// import { getSnapshot } from './protocol'; // To implement

const SOCKET_PATH = process.env.ABRIDGE_SOCK || (process.platform === 'win32'
  ? '\\\\.\\pipe\\abridge'
  : '/tmp/abridge.sock');

export class DaemonServer {
  private server: ReturnType<typeof createServer>;

  constructor() {
    this.server = createServer(this.handleConnection.bind(this));
  }

  public start() {
    // Cleanup old socket
    if (process.platform !== 'win32') {
        try { rmSync(SOCKET_PATH); } catch {}
    }

    this.server.listen(SOCKET_PATH, () => {
      console.log(`[Daemon] Listening on ${SOCKET_PATH}`);
    });

    // Hook into ProcessManager to broadcast changes?
    // For simple polling clients, we just wait for requests.
    // For event driven, we might need a list of active control sockets.
    processManager.on('change', (sessions) => {
        this.broadcast({ method: 'change', params: { sessions: sessions.map(this.serializeSession) } });
    });
  }

  private clients: Set<Socket> = new Set();

  private handleConnection(socket: Socket) {
    console.log('[Daemon] New connection');
    this.clients.add(socket);

    const rpcDataHandler = async (data: Buffer) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
            await this.handleMessage(socket, line);
        } catch (e) {
            console.error('Error handling message:', e);
        }
      }
    };

    socket.on('data', rpcDataHandler);

    socket.on('close', () => {
        this.clients.delete(socket);
    });

    (socket as any).rpcDataHandler = rpcDataHandler;
  }

  private async handleMessage(socket: Socket, raw: string) {
      if (raw.startsWith('ATTACH ')) {
          const sessionId = raw.slice(7).trim();
          this.handleAttach(socket, sessionId);
          return;
      }

      const msg = JSON.parse(raw);
      // RPC Router
      switch (msg.method) {
          case 'list':
              const sessions = processManager.list().map(this.serializeSession);
              socket.write(JSON.stringify({ id: msg.id, result: sessions }) + '\n');
              break;
          case 'spawn':
              const { command, args, cwd } = msg.params;
              const session = processManager.spawn(command, args, cwd);
              socket.write(JSON.stringify({ id: msg.id, result: { id: session.id } }) + '\n');
              break;
          case 'kill':
              const { id } = msg.params;
              processManager.kill(id);
              socket.write(JSON.stringify({ id: msg.id, result: true }) + '\n');
              break;
      }
  }

  private handleAttach(socket: Socket, sessionId: string) {
      const session = processManager.get(sessionId);
      if (!session) {
          socket.end('ERROR: Session not found\n');
          return;
      }

      const rpcDataHandler = (socket as any).rpcDataHandler;
      if (rpcDataHandler) {
          socket.off('data', rpcDataHandler);
      }

      this.clients.delete(socket);
      socket.write(session.getOutput());

      const d1 = session.onData((d) => socket.write(d));
      socket.on('data', (d) => session.write(d.toString()));

      socket.on('close', () => {
          d1.dispose();
      });
  }

  private broadcast(msg: any) {
      const payload = JSON.stringify(msg) + '\n';
      for (const client of this.clients) {
          client.write(payload);
      }
  }

  private serializeSession(s: Session) {
      // Return lightweight metadata, NOT the huge buffer
      return {
          id: s.id,
          metadata: s.metadata,
          // Preview is expensive to compute every ms. 
          // Maybe only send preview on explicit 'get_preview'?
          // Or send it but throttled?
          // For now let's send it in list for simplicity (MVP).
          preview: s.getOutput() 
      };
  }
}
