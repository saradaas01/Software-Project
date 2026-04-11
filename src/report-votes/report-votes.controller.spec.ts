import { Test, TestingModule } from '@nestjs/testing';
import { ReportVotesController } from './report-votes.controller';

describe('ReportVotesController', () => {
  let controller: ReportVotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportVotesController],
    }).compile();

    controller = module.get<ReportVotesController>(ReportVotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
