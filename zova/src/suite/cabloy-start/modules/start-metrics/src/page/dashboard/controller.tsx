import { VBtn, VCard, VCardText, VCol, VContainer, VDataTable, VRow } from 'vuetify/components';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { $QueryEnsureLoaded } from 'zova-module-a-model';

import type { ApiApiStartMetricssnapshotResponseBody } from '../../api/startMetrics.js';

import { ModelMetrics } from '../../model/metrics.js';

type MetricsRuntime = ApiApiStartMetricssnapshotResponseBody['runtime'];
type RuntimeMetric = { label: string; value: string };

const queueHeaders: VDataTable['$props']['headers'] = [
  { title: 'Queue', key: 'name' },
  { title: 'State', key: 'state' },
  { title: 'Observed', key: 'observedAt' },
  { title: 'Schedulers', key: 'schedulers' },
];

@Controller()
export class ControllerPageDashboard extends BeanControllerPageBase {
  @Use()
  $$modelMetrics: ModelMetrics;

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.querySnapshot);
  }

  get querySnapshot() {
    return this.$$modelMetrics.snapshot();
  }

  protected render() {
    const querySnapshot = this.querySnapshot;
    const snapshot = querySnapshot.data!;
    const runtime = snapshot.runtime;
    return (
      <VContainer class="py-6" style={{ maxWidth: '1200px' }}>
        <div class="d-flex flex-wrap align-center justify-space-between" style={{ gap: '16px' }}>
          <div>
            <div class="text-h4 font-weight-bold">Metrics</div>
            <div class="text-body-2 text-medium-emphasis mt-1">Current worker runtime snapshot</div>
          </div>
          <VBtn
            color="primary"
            variant="outlined"
            loading={querySnapshot.isFetching}
            nativeOnClick={this.refresh}
          >
            Refresh
          </VBtn>
        </div>
        {!snapshot.enabled ? (
          <VCard class="mt-6" variant="tonal" color="warning">
            <VCardText>Metrics collection is disabled.</VCardText>
          </VCard>
        ) : (
          <>
            <VRow class="mt-2">
              {getRuntimeMetrics(runtime).map(metric => (
                <VCol key={metric.label} cols={12} sm={6} lg={3}>
                  <VCard class="h-100" variant="outlined">
                    <VCardText>
                      <div class="text-body-2 text-medium-emphasis">{metric.label}</div>
                      <div class="text-h5 font-weight-bold mt-2">{metric.value}</div>
                    </VCardText>
                  </VCard>
                </VCol>
              ))}
            </VRow>
            <VCard class="mt-6" variant="outlined">
              <VCardText>
                <div class="text-h6 font-weight-bold mb-4">Queues</div>
                <VDataTable
                  headers={queueHeaders}
                  items={snapshot.queues}
                  itemsPerPage={-1}
                  hideDefaultFooter
                  noDataText="No queue metrics are available."
                ></VDataTable>
              </VCardText>
            </VCard>
          </>
        )}
      </VContainer>
    );
  }

  refresh = () => this.querySnapshot.refetch();
}

function getRuntimeMetrics(runtime: MetricsRuntime): RuntimeMetric[] {
  return [
    { label: 'Runtime', value: runtime.state },
    { label: 'RSS', value: formatBytes(runtime.rssBytes) },
    { label: 'Heap used', value: formatBytes(runtime.heapUsedBytes) },
    { label: 'Event loop max', value: formatSeconds(runtime.eventLoopDelayMaxSeconds) },
  ];
}

function formatBytes(value?: number): string {
  if (value === undefined) return '—';
  return `${(value / 1024 / 1024).toFixed(1)} MiB`;
}

function formatSeconds(value?: number): string {
  if (value === undefined) return '—';
  return `${(value * 1000).toFixed(1)} ms`;
}
