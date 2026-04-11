import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, MoreThanOrEqual, Between } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
import { ReportAuditLog } from '../report-audit-log/report-audit-log.entity';

@Injectable()
export class ReportsService {
 constructor(
  @InjectRepository(Report)
  private readonly reportRepository: Repository<Report>,

  @InjectRepository(ReportAuditLog)
  private readonly auditRepository: Repository<ReportAuditLog>,
) {}

async create(data: CreateReportDto) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const allReports = await this.reportRepository.find({
    order: {
      created_at: 'DESC',
    },
  });

  const existingReport = allReports.find((report) => {
    const sameCategory = String(report.category).trim().toLowerCase() === String(data.category).trim().toLowerCase();
    const sameRegion =
      String(report.region ?? '').trim().toLowerCase() === String(data.region ?? '').trim().toLowerCase();
    const notRejected = report.status !== 'rejected';

    const reportCreatedAt = new Date(report.created_at);
    const isRecent = reportCreatedAt >= oneDayAgo;

    const latDiff = Math.abs(Number(report.latitude) - Number(data.latitude));
    const lngDiff = Math.abs(Number(report.longitude) - Number(data.longitude));
    const nearbyLocation = latDiff <= 0.01 && lngDiff <= 0.01;
    return sameCategory && sameRegion && notRejected && isRecent && nearbyLocation;
  });

  const report = this.reportRepository.create({
    ...data,
    status: existingReport ? 'duplicate' : 'pending',
    duplicate_of: existingReport ? existingReport.id : undefined,
  });

  return await this.reportRepository.save(report);
}

  async findAll(query: QueryReportsDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reportRepository.createQueryBuilder('report');

    if (query.category) {
      queryBuilder.andWhere('report.category = :category', {
        category: query.category,
      });
    }

    if (query.status) {
      queryBuilder.andWhere('report.status = :status', {
        status: query.status,
      });
    }

    if (query.region) {
      queryBuilder.andWhere('report.region ILIKE :region', {
        region: `%${query.region}%`,
      });
    }

    queryBuilder.orderBy('report.created_at', 'DESC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    return await this.reportRepository.findOne({
      where: { id },
    });
  }

  async updateStatus(
  reportId: string,
  status: 'verified' | 'rejected' | 'duplicate',
  performed_by: string,
  duplicateOf?: string,
) {
  const report = await this.reportRepository.findOne({
    where: { id: reportId },
  });

  if (!report) {
    throw new Error('Report not found');
  }

  report.status = status;

  if (status === 'duplicate' && duplicateOf) {
    report.duplicate_of = duplicateOf;
  }

  await this.reportRepository.save(report);

  const audit = this.auditRepository.create({
    report_id: reportId,
    action: status,
    performed_by,
  });

  await this.auditRepository.save(audit);

  return report;
}
}