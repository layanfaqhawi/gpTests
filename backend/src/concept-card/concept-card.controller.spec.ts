import { Test, TestingModule } from '@nestjs/testing';
import { ConceptCardController } from './concept-card.controller';
import { ConceptCardService } from './concept-card.service';

describe('ConceptCardController', () => {
  let controller: ConceptCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConceptCardController],
      providers: [ConceptCardService],
    }).compile();

    controller = module.get<ConceptCardController>(ConceptCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
