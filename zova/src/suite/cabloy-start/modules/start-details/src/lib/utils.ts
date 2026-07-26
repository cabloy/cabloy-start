import type { BeanBase } from 'zova';
import type { TypeFormScene, TypeOpenapiPermissions } from 'zova-module-a-openapi';

export function checkPermission(
  host: BeanBase,
  permissions: TypeOpenapiPermissions | undefined,
  actionName: string | undefined,
  permissionHint?: { formScene?: TypeFormScene | TypeFormScene[] },
  formScene?: TypeFormScene,
): boolean {
  const formSceneHint = permissionHint?.formScene;
  if (Array.isArray(formSceneHint) && !formSceneHint.includes(formScene!)) return false;
  if (typeof formSceneHint === 'string' && formSceneHint !== formScene) return false;
  return (
    !actionName ||
    host.$passport.checkPermission(permissions, actionName as never, permissionHint as never)
  );
}
