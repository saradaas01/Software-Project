import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './report.entity';
import { ReportAuditLog } from '../report-audit-log/report-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportAuditLog])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}