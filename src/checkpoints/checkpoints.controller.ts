import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { Checkpoint } from './checkpoint.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/v1/checkpoints')
export class CheckpointsController {
  constructor(private readonly checkpointsService: CheckpointsService) {}

  @Get()
  findAll(
    @Query('region') region?: string,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.checkpointsService.findAll(region, type, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkpointsService.findOne(id);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.checkpointsService.getHistory(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  create(@Body() dto: Partial<Checkpoint>) {
    return this.checkpointsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'moderator')
  update(@Param('id') id: string, @Body() dto: Partial<Checkpoint>) {
    return this.checkpointsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.checkpointsService.remove(id);
  }
}