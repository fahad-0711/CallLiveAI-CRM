import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('webhooks/telephony/exotel')
export class ExotelController {
  private readonly logger = new Logger(ExotelController.name);

  @Post('status-callback')
  @HttpCode(HttpStatus.OK)
  async handleStatusCallback(@Body() payload: any) {
    const callSid = payload.CallSid || payload.Sid;
    const status = payload.Status;
    const duration = payload.Duration;
    const from = payload.From;
    const to = payload.To;

    this.logger.log(
      `Received Exotel callback - CallSid: ${callSid}, Status: ${status}, Duration: ${duration}s, From: ${from}, To: ${to}`
    );

    // TODO: Update CallLog workspace entity once database schema is created

    return { success: true };
  }
}
