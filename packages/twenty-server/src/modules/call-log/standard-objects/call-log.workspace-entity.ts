import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { type FieldTypeAndNameMetadata } from 'src/engine/workspace-manager/utils/get-ts-vector-column-expression.util';
import { FieldMetadataType, type ActorMetadata } from 'twenty-shared/types';
import { type EntityRelation } from 'src/engine/workspace-manager/workspace-migration/types/entity-relation.interface';
import { type CallingCampaignWorkspaceEntity } from 'src/modules/calling-campaign/standard-objects/calling-campaign.workspace-entity';
import { type PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

export const SEARCH_FIELDS_FOR_CALL_LOG: FieldTypeAndNameMetadata[] = [
  { name: 'status', type: FieldMetadataType.TEXT },
  { name: 'qualificationStatus', type: FieldMetadataType.TEXT },
];

export class CallLogWorkspaceEntity extends BaseWorkspaceEntity {
  campaign: EntityRelation<CallingCampaignWorkspaceEntity> | null;
  campaignId: string | null;
  contact: EntityRelation<PersonWorkspaceEntity> | null;
  contactId: string | null;
  duration: number;
  status: string;
  qualificationStatus: string;
  transcription: string | null;
  audioUrl: string | null;
  position: number;
  createdBy: ActorMetadata;
  updatedBy: ActorMetadata;
  searchVector: string;
}
