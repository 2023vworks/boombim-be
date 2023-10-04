import { Test, TestingModule } from '@nestjs/testing';
import { GeoMarkController } from './geo-mark.controller';

describe('GeoMarkController', () => {
  let controller: GeoMarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoMarkController],
    }).compile();

    controller = module.get<GeoMarkController>(GeoMarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
