import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { Incident } from './incident.entity';
import { IncidentStatusHistoryModule } from '../incident-status-history/incident-status-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    IncidentStatusHistoryModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}