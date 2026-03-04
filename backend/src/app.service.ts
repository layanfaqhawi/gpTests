import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getGraph() {
    // Simulate fetching graph data from a database or external API
    return {
      A: ['B', 'C'],
      B: ['A', 'D'],
      C: ['A'],
      D: ['B'],
      E: ['F'],
      F: ['E'],
      G: [],
    };
  }
}
