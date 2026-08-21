import type { VonaContext } from 'vona';

import type { IRbacPolicyDecision } from '../types/rbac.ts';

export const SymbolRbacDecision = Symbol('SymbolRbacDecision');

export function createRbacAllScopeDecision(
  action: IRbacPolicyDecision['action'],
): IRbacPolicyDecision {
  return { allowed: true, actionKey: action.actionKey, action, terms: [{ dataScope: 'all' }] };
}

export function hasRbacAllScope(decision: IRbacPolicyDecision): boolean {
  return decision.terms?.some(term => term.dataScope === 'all') === true;
}

export function rbacActionKey(controllerBeanFullName: string, action: string): string {
  return `${controllerBeanFullName}#${action}`;
}

export function getRbacDecision(ctx: VonaContext): IRbacPolicyDecision | undefined {
  return ctx[SymbolRbacDecision];
}

export function setRbacDecision(ctx: VonaContext, decision: IRbacPolicyDecision): void {
  ctx[SymbolRbacDecision] = decision;
}
