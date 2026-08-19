import type { IRbacPolicyDecision } from '../types/rbac.ts';

export const SymbolRbacDecision = Symbol('SymbolRbacDecision');

export function rbacActionKey(controllerBeanFullName: string, action: string): string {
  return `${controllerBeanFullName}#${action}`;
}

export function getRbacDecision(ctx: { state: object }): IRbacPolicyDecision | undefined {
  return (ctx.state as Record<PropertyKey, unknown>)[SymbolRbacDecision] as
    | IRbacPolicyDecision
    | undefined;
}

export function setRbacDecision(ctx: { state: object }, decision: IRbacPolicyDecision): void {
  (ctx.state as Record<PropertyKey, unknown>)[SymbolRbacDecision] = decision;
}
