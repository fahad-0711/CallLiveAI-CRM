import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WorkspaceService } from './engine/core-modules/workspace/services/workspace.service';
import { DataSource } from 'typeorm';
import { UserEntity } from './engine/core-modules/user/user.entity';

async function run() {
  console.log('Bootstrapping application...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  console.log('App bootstrapped!');

  const dataSource = app.get(DataSource);
  const workspaceService = app.get(WorkspaceService);

  const workspaceId = 'ad32508f-0cc8-4554-91ed-cf67de500e6a';
  const userId = 'f86033c6-5cf0-4e38-972e-939e9efea761';

  console.log('Deleting workspace...');
  try {
    await workspaceService.deleteWorkspace(workspaceId, false);
    console.log('Workspace deleted successfully.');
  } catch (err) {
    console.error('Failed to delete workspace:', err);
  }

  console.log('Hard-deleting user...');
  try {
    await dataSource.getRepository(UserEntity).delete(userId);
    console.log('User deleted successfully.');
  } catch (err) {
    console.error('Failed to delete user:', err);
  }

  await app.close();
}

run().catch((err) => {
  console.error('Script failed:', err);
  process.exit(1);
});
