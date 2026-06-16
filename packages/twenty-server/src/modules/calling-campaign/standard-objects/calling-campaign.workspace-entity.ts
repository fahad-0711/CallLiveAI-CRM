import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { FieldMetadataType, type ActorMetadata } from 'twenty-shared/types';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type AIAssistantWorkspaceEntity } from 'src/modules/ai-assistant/standard-objects/ai-assistant.workspace-entity';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_CALLING_CAMPAIGN: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class CallingCampaignWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  status: string;
  aiAssistant: EntityRelation<AIAssistantWorkspaceEntity> | null;
  aiAssistantId: string | null;
  leadSourceCsvUrl: string | null;
  totalLeads: number;
  completedCalls: number;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;
}
