import { Test, TestingModule } from '@nestjs/testing';
import { SchoolGoalController } from './school-goal.controller';

describe('SchoolGoalController', () => {
  let controller: SchoolGoalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolGoalController],
    }).compile();

    controller = module.get<SchoolGoalController>(SchoolGoalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
