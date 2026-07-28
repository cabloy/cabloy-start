import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiStartMetricssnapshotResponseBody } from '../api/startMetrics.js';

export interface IModelOptionsMetrics extends IDecoratorModelOptions {}

@Model<IModelOptionsMetrics>()
export class ModelMetrics extends BeanModelBase {
  snapshot() {
    return this.$useStateData<ApiApiStartMetricssnapshotResponseBody>({
      queryKey: ['startMetricsSnapshot'],
      queryFn: () => this.scope.api.startMetrics.snapshot(),
      staleTime: 15000,
    });
  }
}
