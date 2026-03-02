import { Module } from '@nestjs/common';
import { ConceptCardService } from './concept-card.service';
import { ConceptCardController } from './concept-card.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConceptCardController],
  providers: [ConceptCardService],
})
export class ConceptCardModule {}
