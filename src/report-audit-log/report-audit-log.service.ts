import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportAuditLog } from './report-audit-log.entity';

@Injectable()
export class ReportAuditLogService {
  constructor(
    @InjectRepository(ReportAuditLog)
    private auditRepository: Repository<ReportAuditLog>,
  ) {}

  async create(data: Partial<ReportAuditLog>) {
    const log = this.auditRepository.create(data);
    return await this.auditRepository.save(log);
  }

  async findByReport(report_id: string) {
    return await this.auditRepository.find({
      where: { report_id },
      order: { performed_at: 'DESC' },
    });
  }
}