
import * as os from 'os';
import * as pty from '@skitee3000/bun-pty';

console.log("Testing node-pty...");

try {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env as any
  });

  ptyProcess.onData((data) => {
    console.log("Received data from PTY:", data.trim());
    if (data.includes('hello from pty')) {
      console.log("Test Passed!");
      process.exit(0);
    }
  });

  console.log("Writing to PTY...");
  ptyProcess.write('echo "hello from pty"\r');

  setTimeout(() => {
    console.log("Timeout waiting for PTY response.");
    process.exit(1);
  }, 2000);

} catch (error) {
  console.error("Failed to spawn PTY:", error);
  process.exit(1);
}
