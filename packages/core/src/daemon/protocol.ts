import type { Session, ProcessMetadata } from '../process/session';

export interface IPCMessage {
  id?: number;
  method?: string;
  result?: any;
  error?: any;
  params?: any;
}

export interface SerializedSession {
  id: string;
  metadata: ProcessMetadata;
  preview: string;
}

export interface DaemonRequest {
    list: void;
    spawn: { command: string; args: string[]; cwd: string };
    kill: { id: string };
}
