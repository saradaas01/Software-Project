import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { Incident } from './incident.entity';
import { IncidentStatusHistoryModule } from '../incident-status-history/incident-status-history.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    IncidentStatusHistoryModule,
    AlertsModule,
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}