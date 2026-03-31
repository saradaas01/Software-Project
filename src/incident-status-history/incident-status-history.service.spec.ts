import { Test, TestingModule } from '@nestjs/testing';
import { IncidentStatusHistoryService } from './incident-status-history.service';

describe('IncidentStatusHistoryService', () => {
  let service: IncidentStatusHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentStatusHistoryService],
    }).compile();

    service = module.get<IncidentStatusHistoryService>(IncidentStatusHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
