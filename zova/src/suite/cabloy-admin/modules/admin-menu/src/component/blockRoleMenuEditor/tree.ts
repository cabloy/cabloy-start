import type {
  TypeRoleMenuConfigurationGroup,
  TypeRoleMenuConfigurationMenu,
  TypeRoleMenuConfigurationSite,
} from '../../model/roleMenu.js';

export interface IRoleMenuTreeMenu extends TypeRoleMenuConfigurationMenu {
  id: string;
  kind: 'menu';
  ssrSiteName: string;
}

export interface IRoleMenuTreeGroup extends TypeRoleMenuConfigurationGroup {
  id: string;
  kind: 'group';
  children: IRoleMenuTreeNode[];
}

export type IRoleMenuTreeNode = IRoleMenuTreeMenu | IRoleMenuTreeGroup;

export interface IRoleMenuTreeSite {
  ssrSiteName: string;
  title: string;
  children: IRoleMenuTreeNode[];
}

export interface IRoleMenuTreeGroupState {
  menus: IRoleMenuTreeMenu[];
  enabled: boolean;
  indeterminate: boolean;
  targetEnabled: boolean;
}

export function getConfigurableDescendantMenus(group: IRoleMenuTreeGroup): IRoleMenuTreeMenu[] {
  const groups = new Set<string>();
  const menus = new Map<string, IRoleMenuTreeMenu>();
  const visit = (node: IRoleMenuTreeNode) => {
    if (node.kind === 'menu') {
      if (node.configurable) {
        menus.set(JSON.stringify([node.ssrSiteName, node.ssrMenuName]), node);
      }
      return;
    }
    if (groups.has(node.id)) return;
    groups.add(node.id);
    for (const child of node.children) visit(child);
  };
  visit(group);
  return [...menus.values()];
}

export function getRoleMenuTreeGroupState(
  group: IRoleMenuTreeGroup,
  getEnabled: (menu: IRoleMenuTreeMenu) => boolean,
): IRoleMenuTreeGroupState {
  const menus = getConfigurableDescendantMenus(group);
  const enabledCount = menus.filter(getEnabled).length;
  const enabled = menus.length > 0 && enabledCount === menus.length;
  const indeterminate = enabledCount > 0 && enabledCount < menus.length;
  return {
    menus,
    enabled,
    indeterminate,
    targetEnabled: indeterminate || !enabled,
  };
}

function normalizeGroups(group: string | string[] | undefined): string[] {
  return group === undefined ? [] : [...new Set(Array.isArray(group) ? group : [group])];
}

function nodeIdentifier(node: IRoleMenuTreeNode): string {
  return node.kind === 'menu' ? node.ssrMenuName : node.ssrMenuGroupName;
}

function nodeTitle(node: IRoleMenuTreeNode): string {
  return node.title?.trim() || nodeIdentifier(node);
}

function compareTreeNodes(left: IRoleMenuTreeNode, right: IRoleMenuTreeNode) {
  return (
    (left.order ?? 0) - (right.order ?? 0) ||
    nodeTitle(left).localeCompare(nodeTitle(right)) ||
    nodeIdentifier(left).localeCompare(nodeIdentifier(right))
  );
}

export function createRoleMenuTree(site: TypeRoleMenuConfigurationSite): IRoleMenuTreeSite {
  const groupByName = new Map(site.groups.map(group => [group.ssrMenuGroupName, group]));
  const childGroupsByParent = new Map<string, string[]>();
  const rootGroupNames: string[] = [];

  for (const group of site.groups) {
    const parentNames = normalizeGroups(group.group).filter(
      candidate => candidate !== group.ssrMenuGroupName && groupByName.has(candidate),
    );
    if (parentNames.length === 0) {
      rootGroupNames.push(group.ssrMenuGroupName);
      continue;
    }
    for (const parentName of parentNames) {
      const children = childGroupsByParent.get(parentName) ?? [];
      children.push(group.ssrMenuGroupName);
      childGroupsByParent.set(parentName, children);
    }
  }

  const menusByGroup = new Map<string, TypeRoleMenuConfigurationMenu[]>();
  const rootMenus: TypeRoleMenuConfigurationMenu[] = [];
  for (const menu of site.menus) {
    const groupNames = normalizeGroups(menu.group).filter(candidate => groupByName.has(candidate));
    if (groupNames.length === 0) {
      rootMenus.push(menu);
      continue;
    }
    for (const groupName of groupNames) {
      const children = menusByGroup.get(groupName) ?? [];
      children.push(menu);
      menusByGroup.set(groupName, children);
    }
  }

  const createMenu = (
    menu: TypeRoleMenuConfigurationMenu,
    groupPath: readonly string[],
  ): IRoleMenuTreeMenu => ({
    ...menu,
    id: JSON.stringify(['menu', ...groupPath, menu.ssrMenuName]),
    kind: 'menu',
    ssrSiteName: site.ssrSiteName,
  });
  const reachableGroupNames = new Set<string>();
  const visitReachableGroup = (groupName: string) => {
    if (reachableGroupNames.has(groupName)) return;
    reachableGroupNames.add(groupName);
    for (const childGroupName of childGroupsByParent.get(groupName) ?? []) {
      visitReachableGroup(childGroupName);
    }
  };
  for (const groupName of rootGroupNames) visitReachableGroup(groupName);

  const buildGroup = (
    groupName: string,
    ancestors: readonly string[],
  ): IRoleMenuTreeGroup | undefined => {
    const group = groupByName.get(groupName);
    if (!group || ancestors.includes(groupName)) return undefined;
    const groupPath = [...ancestors, groupName];
    const children: IRoleMenuTreeNode[] = (menusByGroup.get(groupName) ?? []).map(menu =>
      createMenu(menu, groupPath),
    );
    for (const childGroupName of childGroupsByParent.get(groupName) ?? []) {
      const childGroup = buildGroup(childGroupName, groupPath);
      if (childGroup) children.push(childGroup);
    }
    return {
      ...group,
      id: JSON.stringify(['group', ...groupPath]),
      kind: 'group',
      children: children.toSorted(compareTreeNodes),
    };
  };

  const rootChildren: IRoleMenuTreeNode[] = rootMenus.map(menu => createMenu(menu, []));
  const rootOrRecoveredGroupNames = [
    ...rootGroupNames,
    ...site.groups
      .map(group => group.ssrMenuGroupName)
      .filter(groupName => !reachableGroupNames.has(groupName)),
  ];
  for (const groupName of rootOrRecoveredGroupNames) {
    const group = buildGroup(groupName, []);
    if (group) rootChildren.push(group);
  }

  return {
    ssrSiteName: site.ssrSiteName,
    title: site.title,
    children: rootChildren.toSorted(compareTreeNodes),
  };
}
