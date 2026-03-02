import { PartialType } from '@nestjs/mapped-types';
import { CreateConceptCardDto } from './create-concept-card.dto';

export class UpdateConceptCardDto extends PartialType(CreateConceptCardDto) {}
