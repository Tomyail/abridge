import { DaemonClient } from '@abridge/core';

async function main() {
  console.log('Connecting to daemon...');
  const client = new DaemonClient();
  await client.connect();
  console.log('Connected!');

  console.log('Listing sessions...');
  const sessions = await client.list();
  console.log('Sessions:', sessions);

  console.log('Spawning a test task...');
  await client.spawn('echo', ['Hello from test_client'], process.cwd());
  
  // Wait a bit for update
  await new Promise(r => setTimeout(r, 1000));
  
  const sessionsAfter = await client.list();
  console.log('Sessions after spawn:', sessionsAfter);
  
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
