import { Test, TestingModule } from '@nestjs/testing';
import { IncidentStatusHistorynpxService } from './incident-status-historynpx.service';

describe('IncidentStatusHistorynpxService', () => {
  let service: IncidentStatusHistorynpxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncidentStatusHistorynpxService],
    }).compile();

    service = module.get<IncidentStatusHistorynpxService>(IncidentStatusHistorynpxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
