import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/engine/guards/jwt-auth.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';
import { CallingCampaignWorkspaceEntity } from '../standard-objects/calling-campaign.workspace-entity';
import { getWorkspaceAuthContext } from 'src/engine/core-modules/auth/storage/workspace-auth-context.storage';

@Controller('rest/calling-campaigns')
@UseGuards(JwtAuthGuard, WorkspaceAuthGuard)
export class CallingCampaignController {
  constructor(
    private readonly globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
  ) {}

  private async getRepository() {
    const { workspace } = getWorkspaceAuthContext();
    return this.globalWorkspaceOrmManager.getRepository<CallingCampaignWorkspaceEntity>(
      workspace.id,
      'callingCampaign',
    );
  }

  @Get()
  async findAll() {
    const repo = await this.getRepository();
    return repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const repo = await this.getRepository();
    return repo.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: any) {
    const repo = await this.getRepository();
    const campaign = repo.create({
      ...body,
      status: body.status || 'Draft',
      totalLeads: body.totalLeads || 0,
      completedCalls: 0,
      position: 0,
    });
    return repo.save(campaign);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const repo = await this.getRepository();
    await repo.update(id, body);
    return repo.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const repo = await this.getRepository();
    await repo.delete(id);
    return { success: true };
  }
}
