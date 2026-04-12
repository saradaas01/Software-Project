import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentStatusHistoryService } from './incident-status-history.service';
import { IncidentStatusHistory } from './incident-status-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IncidentStatusHistory])],
  providers: [IncidentStatusHistoryService],
  exports: [IncidentStatusHistoryService],
})
export class IncidentStatusHistoryModule {}