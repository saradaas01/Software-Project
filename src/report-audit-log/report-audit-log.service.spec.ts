import { Test, TestingModule } from '@nestjs/testing';
import { ReportAuditLogService } from './report-audit-log.service';

describe('ReportAuditLogService', () => {
  let service: ReportAuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportAuditLogService],
    }).compile();

    service = module.get<ReportAuditLogService>(ReportAuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
