import { Module } from '@nestjs/common';
import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { CallLogController } from './controllers/call-log.controller';

@Module({
  imports: [AuthModule, TwentyORMModule, WorkspaceCacheStorageModule],
  controllers: [CallLogController],
})
export class CallLogModule {}
