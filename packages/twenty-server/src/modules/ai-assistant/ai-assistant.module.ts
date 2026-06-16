import { Module } from '@nestjs/common';
import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { AIAssistantController } from './controllers/ai-assistant.controller';

@Module({
  imports: [AuthModule, TwentyORMModule, WorkspaceCacheStorageModule],
  controllers: [AIAssistantController],
})
export class AIAssistantModule {}
