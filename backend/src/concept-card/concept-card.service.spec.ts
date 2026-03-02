import { Test, TestingModule } from '@nestjs/testing';
import { ConceptCardService } from './concept-card.service';

describe('ConceptCardService', () => {
  let service: ConceptCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConceptCardService],
    }).compile();

    service = module.get<ConceptCardService>(ConceptCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
