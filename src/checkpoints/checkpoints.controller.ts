import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { Checkpoint } from './checkpoint.entity';

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

  @Post()
  create(@Body() dto: Partial<Checkpoint>) {
    return this.checkpointsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Checkpoint>) {
    return this.checkpointsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkpointsService.remove(id);
  }
}