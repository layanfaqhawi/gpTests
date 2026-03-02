export type GeneratorType = 'graph' | 'function' | 'recurrence' | 'loop';

export type BaseGeneratorConfig<TType extends GeneratorType, TData> = {
  configType: 'generator';
  version: string;
  type: TType;
  data: TData;
};

export type GraphGeneratorData = {
  id: string;
  directed: boolean;
  weighted: boolean;
  cyclic: boolean;
  connected: boolean;
};

export type GraphGeneratorConfig = BaseGeneratorConfig<
  'graph',
  GraphGeneratorData
>;

export type GeneratorConfig = GraphGeneratorConfig;
