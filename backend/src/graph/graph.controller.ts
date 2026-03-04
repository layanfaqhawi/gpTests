import { Body, Controller, Post } from '@nestjs/common';
import { GenerateGraphRequest } from 'src/typescript/generate-graph-request';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post('generate')
  async generateGraph(@Body() request: GenerateGraphRequest) {
    return this.graphService.generateGraph(request);
  }
}
