import { Module } from '@nestjs/common';

import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { TelephonyModule } from 'src/modules/telephony/telephony.module';
import { WhatsappModule } from 'src/modules/whatsapp/whatsapp.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';
import { WorkspaceMemberModule } from 'src/modules/workspace-member/workspace-member.module';
import { AIAssistantModule } from 'src/modules/ai-assistant/ai-assistant.module';
import { CallingCampaignModule } from 'src/modules/calling-campaign/calling-campaign.module';
import { CallLogModule } from 'src/modules/call-log/call-log.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    WorkflowModule,
    WorkspaceMemberModule,
    WhatsappModule,
    TelephonyModule,
    AIAssistantModule,
    CallingCampaignModule,
    CallLogModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
