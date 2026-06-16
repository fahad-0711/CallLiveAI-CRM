import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { FieldMetadataType, type ActorMetadata } from 'twenty-shared/types';

const NAME_FIELD_NAME = 'name';

export const SEARCH_FIELDS_FOR_AI_ASSISTANT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
];

export class AIAssistantWorkspaceEntity extends BaseWorkspaceEntity {
  name: string;
  promptTemplate: string;
  voiceId: string;
  telephonyProvider: string;
  telephonyConfig: string | null;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;
}
