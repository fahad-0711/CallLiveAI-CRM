import { Module } from '@nestjs/common';
import { TwilioController } from './controllers/twilio.controller';
import { ExotelController } from './controllers/exotel.controller';
import { PlivoController } from './controllers/plivo.controller';

@Module({
  controllers: [TwilioController, ExotelController, PlivoController],
})
export class TelephonyModule {}
