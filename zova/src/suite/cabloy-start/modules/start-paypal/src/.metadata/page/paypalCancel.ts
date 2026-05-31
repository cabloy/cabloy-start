import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPagePaypalCancel } from '../../page/paypalCancel/controller.jsx';
import { ControllerPagePaypalCancelSchemaQuery } from '../../page/paypalCancel/controller.jsx';
import { RenderPagePaypalCancel } from '../../page/paypalCancel/render.jsx';
export namespace NSControllerPagePaypalCancel {
  export const querySchema = ControllerPagePaypalCancelSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPagePaypalCancelSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPagePaypalCancelSchemaQuery>;
}
declare module 'zova-module-start-paypal' {
  export interface RenderPagePaypalCancel extends ControllerPagePaypalCancel {}
}
export const ZPagePaypalCancel = createZovaComponentPage(
  ControllerPagePaypalCancel,
  RenderPagePaypalCancel,
  undefined,
);
