import { Test, TestingModule } from '@nestjs/testing';
import { CheckpointStatusHistoryService } from './checkpoint-status-history.service';

describe('CheckpointStatusHistoryService', () => {
  let service: CheckpointStatusHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckpointStatusHistoryService],
    }).compile();

    service = module.get<CheckpointStatusHistoryService>(CheckpointStatusHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
