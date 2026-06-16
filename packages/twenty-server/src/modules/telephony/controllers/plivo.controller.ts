import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('webhooks/telephony/plivo')
export class PlivoController {
  private readonly logger = new Logger(PlivoController.name);

  @Post('status-callback')
  @HttpCode(HttpStatus.OK)
  async handleStatusCallback(@Body() payload: any) {
    const callUuid = payload.CallUUID;
    const event = payload.Event;
    const duration = payload.Duration;
    const from = payload.From;
    const to = payload.To;

    this.logger.log(
      `Received Plivo callback - CallUUID: ${callUuid}, Event: ${event}, Duration: ${duration}s, From: ${from}, To: ${to}`
    );

    // TODO: Update CallLog workspace entity once database schema is created

    return { success: true };
  }
}
