import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';

@Controller('webhooks/telephony/twilio')
export class TwilioController {
  private readonly logger = new Logger(TwilioController.name);

  @Post('status-callback')
  @HttpCode(HttpStatus.OK)
  async handleStatusCallback(@Body() payload: any) {
    const callSid = payload.CallSid;
    const callStatus = payload.CallStatus;
    const duration = payload.CallDuration;
    const from = payload.From;
    const to = payload.To;

    this.logger.log(
      `Received Twilio callback - CallSid: ${callSid}, Status: ${callStatus}, Duration: ${duration}s, From: ${from}, To: ${to}`
    );

    // TODO: Update CallLog workspace entity once database schema is created

    return { success: true };
  }

  @Post('twiml')
  @HttpCode(HttpStatus.OK)
  async getTwiMLInstructions(@Body() payload: any) {
    const callSid = payload.CallSid;
    this.logger.log(`Generating TwiML instructions for CallSid: ${callSid}`);

    // Return TwiML instructions to connect the call to the AI voice agent stream
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Connecting to your CallLive AI Assistant. Please wait.</Say>
  <!-- Replace with actual AI agent stream endpoint -->
  <Connect>
    <Stream url="wss://${process.env.APP_DOMAIN || 'calllive.ai'}/audio-stream/${callSid}" />
  </Connect>
</Response>`;
  }
}
