import { Module } from '@nestjs/common';
import { WhatsappController } from './controllers/whatsapp.controller';

@Module({
  controllers: [WhatsappController],
})
export class WhatsappModule {}
