import { Injectable } from '@nestjs/common';
import { CreateConceptCardDto } from './dto/create-concept-card.dto';
import { UpdateConceptCardDto } from './dto/update-concept-card.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConceptCardService {
  constructor(private readonly prismaService: PrismaService) {}
  
  async createCard(conceptCard: any) {
    console.log('Creating concept card - service:', conceptCard);
    return this.prismaService.conceptCard.create({
      data: conceptCard,
    });
  }

  findAll() {
    return `This action returns all conceptCard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conceptCard`;
  }

  update(id: number, updateConceptCardDto: UpdateConceptCardDto) {
    return `This action updates a #${id} conceptCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} conceptCard`;
  }
}
