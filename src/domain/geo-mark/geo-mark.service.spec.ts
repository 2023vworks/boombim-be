import { Test, TestingModule } from '@nestjs/testing';
import { GeoMarkService } from './geo-mark.service';

describe('GeoMarkService', () => {
  let service: GeoMarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoMarkService],
    }).compile();

    service = module.get<GeoMarkService>(GeoMarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
