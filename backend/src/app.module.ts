import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConceptCardModule } from './concept-card/concept-card.module';

@Module({
  imports: [ConceptCardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
