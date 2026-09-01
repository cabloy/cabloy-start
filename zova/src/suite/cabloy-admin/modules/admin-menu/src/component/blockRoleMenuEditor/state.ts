export interface IRoleMenuEditorChange {
  ssrSiteName: string;
  ssrMenuName: string;
  enabled: boolean;
}

export interface IRoleMenuEditorOperation {
  token: number;
  changes: IRoleMenuEditorChange[];
}

export interface IRoleMenuEditorLayer {
  token: number;
  enabled: boolean;
  committed: boolean;
}

export type RoleMenuEditorLayers = Record<string, IRoleMenuEditorLayer[] | undefined>;

export function roleMenuEditorMenuKey(
  menu: Pick<IRoleMenuEditorChange, 'ssrSiteName' | 'ssrMenuName'>,
) {
  return JSON.stringify([menu.ssrSiteName, menu.ssrMenuName]);
}

export function normalizeRoleMenuEditorChanges(changes: IRoleMenuEditorChange[]) {
  return [
    ...new Map(changes.map(change => [roleMenuEditorMenuKey(change), change])).values(),
  ].toSorted((left, right) =>
    roleMenuEditorMenuKey(left).localeCompare(roleMenuEditorMenuKey(right)),
  );
}

export function applyRoleMenuEditorOperation(
  layers: RoleMenuEditorLayers,
  operation: IRoleMenuEditorOperation,
) {
  for (const change of operation.changes) {
    const key = roleMenuEditorMenuKey(change);
    const menuLayers = layers[key] ?? [];
    menuLayers.push({ token: operation.token, enabled: change.enabled, committed: false });
    layers[key] = menuLayers;
  }
}

export function commitRoleMenuEditorOperation(
  layers: RoleMenuEditorLayers,
  operation: IRoleMenuEditorOperation,
) {
  for (const change of operation.changes) {
    const menuLayers = layers[roleMenuEditorMenuKey(change)];
    const layer = menuLayers?.find(item => item.token === operation.token);
    if (layer) layer.committed = true;
  }
}

export function rejectRoleMenuEditorOperation(
  layers: RoleMenuEditorLayers,
  operation: IRoleMenuEditorOperation,
) {
  for (const change of operation.changes) {
    const key = roleMenuEditorMenuKey(change);
    const menuLayers = layers[key]?.filter(item => item.token !== operation.token) ?? [];
    if (menuLayers.length > 0) {
      layers[key] = menuLayers;
    } else {
      delete layers[key];
    }
  }
}

export function getRoleMenuEditorEnabled(
  layers: RoleMenuEditorLayers,
  menu: Pick<IRoleMenuEditorChange, 'ssrSiteName' | 'ssrMenuName'>,
  fallback: boolean,
) {
  const menuLayers = layers[roleMenuEditorMenuKey(menu)];
  return menuLayers?.at(-1)?.enabled ?? fallback;
}

export function reconcileRoleMenuEditorLayers(
  layers: RoleMenuEditorLayers,
  getCommittedEnabled: (key: string) => boolean | undefined,
) {
  for (const [key, menuLayers] of Object.entries(layers)) {
    if (!menuLayers) continue;
    const committedEnabled = getCommittedEnabled(key);
    if (committedEnabled === undefined) continue;
    const index = menuLayers.findLastIndex(
      layer => layer.committed && layer.enabled === committedEnabled,
    );
    if (index < 0) continue;
    const remaining = menuLayers.slice(index + 1);
    if (remaining.length > 0) {
      layers[key] = remaining;
    } else {
      delete layers[key];
    }
  }
}
