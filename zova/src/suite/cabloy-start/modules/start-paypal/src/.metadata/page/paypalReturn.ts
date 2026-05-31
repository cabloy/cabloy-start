import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPagePaypalReturn } from '../../page/paypalReturn/controller.jsx';
import { ControllerPagePaypalReturnSchemaQuery } from '../../page/paypalReturn/controller.jsx';
import { RenderPagePaypalReturn } from '../../page/paypalReturn/render.jsx';
export namespace NSControllerPagePaypalReturn {
  export const querySchema = ControllerPagePaypalReturnSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPagePaypalReturnSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPagePaypalReturnSchemaQuery>;
}
declare module 'zova-module-start-paypal' {
  export interface RenderPagePaypalReturn extends ControllerPagePaypalReturn {}
}
export const ZPagePaypalReturn = createZovaComponentPage(
  ControllerPagePaypalReturn,
  RenderPagePaypalReturn,
  undefined,
);
