import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { Incident } from './incident.entity';

@Controller('api/v1/incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  findAll(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.incidentsService.findAll(type, severity, status, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: Partial<Incident>) {
    return this.incidentsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Incident>) {
    return this.incidentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}