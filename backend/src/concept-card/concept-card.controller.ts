import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConceptCardService } from './concept-card.service';
import { CreateConceptCardDto } from './dto/create-concept-card.dto';
import { UpdateConceptCardDto } from './dto/update-concept-card.dto';

@Controller('concept-card')
export class ConceptCardController {
  constructor(private readonly conceptCardService: ConceptCardService) {}

  @Post()
  create(@Body() conceptCard: any) {
    console.log('Received concept card:', conceptCard);
    return this.conceptCardService.createCard(conceptCard);
  }

  @Get()
  findAll() {
    return this.conceptCardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conceptCardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConceptCardDto: UpdateConceptCardDto) {
    return this.conceptCardService.update(+id, updateConceptCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conceptCardService.remove(+id);
  }
}
