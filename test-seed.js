const { Client } = require('pg');

async function test() {
  const client = new Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/default',
  });
  await client.connect();

  console.log('Connected to PG');

  try {
    await client.query('BEGIN');

    // 1. Insert Workspace
    console.log('Inserting workspace...');
    await client.query(`
      INSERT INTO "core"."workspace"(
        "id", "displayName", "subdomain", "inviteHash", "logo", "activationStatus", "isTwoFactorAuthenticationEnforced", "workspaceCustomApplicationId"
      ) VALUES (
        '20202020-1c25-4d02-bf25-6aeccf7ea419', 'Apple', 'apple', 'apple.dev-invite-hash', 'https://twentyhq.github.io/placeholder-images/workspaces/apple-logo.png', 'PENDING_CREATION', false, 'c473d1b3-aabe-47f8-a0ff-5a4ef040dfec'
      ) ON CONFLICT DO NOTHING;
    `);

    // 2. Insert Application
    console.log('Inserting application...');
    await client.query(`
      INSERT INTO "core"."application"(
        "id", "workspaceId", "name", "universalIdentifier", "version", "sourcePath", "canBeUninstalled", "availablePackages"
      ) VALUES (
        'c473d1b3-aabe-47f8-a0ff-5a4ef040dfec', '20202020-1c25-4d02-bf25-6aeccf7ea419', 'Custom', 'c473d1b3-aabe-47f8-a0ff-5a4ef040dfec', '1.0.1', 'workspace-custom', false, '[]'
      ) ON CONFLICT DO NOTHING;
    `);

    // 3. Insert File
    console.log('Inserting file...');
    await client.query(`
      INSERT INTO "core"."file"(
        "workspaceId", "applicationId", "path", "size", "mimeType"
      ) VALUES (
        '20202020-1c25-4d02-bf25-6aeccf7ea419', 'c473d1b3-aabe-47f8-a0ff-5a4ef040dfec', 'dependencies\\package.json', 1379, 'application/json'
      );
    `);

    console.log('All inserts succeeded inside the transaction!');
    await client.query('ROLLBACK');
  } catch (err) {
    console.error('Test failed with error:', err);
    try {
      await client.query('ROLLBACK');
    } catch (rbErr) {
      console.error('Rollback failed:', rbErr);
    }
  } finally {
    await client.end();
  }
}

test();
