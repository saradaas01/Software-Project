import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportAuditLogService } from './report-audit-log.service';
import { ReportAuditLog } from './report-audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportAuditLog])],
  providers: [ReportAuditLogService],
  exports: [ReportAuditLogService],
})
export class ReportAuditLogModule {}