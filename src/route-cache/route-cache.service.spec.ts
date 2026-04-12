import { Test, TestingModule } from '@nestjs/testing';
import { RouteCacheService } from './route-cache.service';

describe('RouteCacheService', () => {
  let service: RouteCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RouteCacheService],
    }).compile();

    service = module.get<RouteCacheService>(RouteCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
