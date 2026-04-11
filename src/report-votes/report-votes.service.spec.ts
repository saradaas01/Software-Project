import { Test, TestingModule } from '@nestjs/testing';
import { ReportVotesService } from './report-votes.service';

describe('ReportVotesService', () => {
  let service: ReportVotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportVotesService],
    }).compile();

    service = module.get<ReportVotesService>(ReportVotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
