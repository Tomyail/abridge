// Polyfill for xterm-headless which expects browser globals
if (typeof global !== 'undefined') {
  if (!(global as any).window) {
    (global as any).window = global;
  }
  if (!(global as any).document) {
    (global as any).document = {
      createElement: () => ({}),
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  }
  if (!(global as any).self) {
    (global as any).self = global;
  }
  if (!(global as any).navigator) {
      (global as any).navigator = { userAgent: 'node' };
  }
}
