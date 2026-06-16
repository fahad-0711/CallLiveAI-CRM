import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('webhooks/whatsapp')
export class WhatsappController {
  
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'my_secure_token';
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return challenge;
    }
    return 'Verification failed';
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleIncomingMessage(@Body() payload: any) {
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (message) {
      const customerPhone = message.from;
      const messageBody = message.text?.body;
      console.log(`Received WhatsApp from ${customerPhone}: ${messageBody}`);
    }

    return { success: true };
  }
}
