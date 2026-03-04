import type { GeneratorConfig } from './types';

export type GenerateGraphRequest = {
  config: GeneratorConfig;
  num_nodes: number;
  num_edges: number;
};
