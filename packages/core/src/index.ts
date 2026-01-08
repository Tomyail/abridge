export const version = '0.1.0';

export * from './config/loader';
export * from './config/schema.js';
export * from './config/loader.js';
export * from './config/merger.js';
export * from './process/manager.js';
export * from './process/session.js';
export * from './adapters/index.js';
export * from './sync/manager.js';

export * from './daemon/client.js';
export * from './daemon/protocol.js';
// We don't export server by default to avoid accidental bundling in client-only code?
// Actually for monorepo it's fine.
export * from './daemon/server.js';
