const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=> Starting Twenty CRM Windows Dev Environment Setup...');

// 1. Copy .env files
try {
  const frontEnvEx = path.join(__dirname, 'packages', 'twenty-front', '.env.example');
  const frontEnv = path.join(__dirname, 'packages', 'twenty-front', '.env');
  const serverEnvEx = path.join(__dirname, 'packages', 'twenty-server', '.env.example');
  const serverEnv = path.join(__dirname, 'packages', 'twenty-server', '.env');

  if (fs.existsSync(frontEnvEx) && !fs.existsSync(frontEnv)) {
    fs.copyFileSync(frontEnvEx, frontEnv);
    console.log('   done: packages/twenty-front/.env created');
  }
  if (fs.existsSync(serverEnvEx) && !fs.existsSync(serverEnv)) {
    fs.copyFileSync(serverEnvEx, serverEnv);
    console.log('   done: packages/twenty-server/.env created');
  }
} catch (err) {
  console.error('Failed to copy .env files:', err.message);
}

// 2. Start Docker Compose services
try {
  console.log('=> Starting PostgreSQL & Redis via Docker...');
  const composePath = path.join(__dirname, 'packages', 'twenty-docker', 'docker-compose.dev.yml');
  execSync(`docker compose -f "${composePath}" up -d`, { stdio: 'inherit' });
  console.log('   done: Services started.');
} catch (err) {
  console.error('\nFAIL: Could not start Docker services. Is Docker Desktop running?\n');
  process.exit(1);
}

// 3. Create databases
try {
  console.log('=> Creating databases "default" and "test"...');
  const composePath = path.join(__dirname, 'packages', 'twenty-docker', 'docker-compose.dev.yml');
  execSync(`docker compose -f "${composePath}" exec -T db psql -U postgres -d postgres -c "CREATE DATABASE default;"`, { stdio: 'ignore' });
  execSync(`docker compose -f "${composePath}" exec -T db psql -U postgres -d postgres -c "CREATE DATABASE test;"`, { stdio: 'ignore' });
  console.log('   done: Databases initialized.');
} catch (err) {
  // Ignore error if databases already exist
}

// 4. Initialize schema
try {
  console.log('=> Initializing database schema (running migrations)...');
  execSync('npx nx database:init twenty-server', { stdio: 'inherit' });
  console.log('   done: Database migrations completed.');
} catch (err) {
  console.error('Failed to run migrations. Try running "npx nx database:init twenty-server" manually.');
}

console.log('\n=============================================');
console.log('Dev environment ready! Run:');
console.log('  yarn start');
console.log('Then open: http://localhost:3000');
console.log('=============================================\n');
