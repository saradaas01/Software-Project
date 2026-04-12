import { Test, TestingModule } from '@nestjs/testing';
import { AlertRecordsService } from './alert-records.service';

describe('AlertRecordsService', () => {
  let service: AlertRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlertRecordsService],
    }).compile();

    service = module.get<AlertRecordsService>(AlertRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
