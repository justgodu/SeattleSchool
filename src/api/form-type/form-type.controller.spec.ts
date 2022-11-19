import { Test, TestingModule } from '@nestjs/testing';
import { FormTypeController } from './form-type.controller';

describe('FormTypeController', () => {
  let controller: FormTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormTypeController],
    }).compile();

    controller = module.get<FormTypeController>(FormTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
