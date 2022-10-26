import { Test, TestingModule } from '@nestjs/testing';
import { SchoolGoalService } from './school-goal.service';

describe('SchoolGoalService', () => {
  let service: SchoolGoalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchoolGoalService],
    }).compile();

    service = module.get<SchoolGoalService>(SchoolGoalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
