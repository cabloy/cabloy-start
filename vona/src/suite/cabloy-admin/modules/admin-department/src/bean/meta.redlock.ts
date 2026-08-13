import { Meta } from 'vona-module-a-meta';
import { BeanRedlockBase } from 'vona-module-a-redlock';

export type TypeRedlockLockResource = `department.siblings.${string}`;
export type TypeRedlockLockIsolateResource = never;

@Meta()
export class MetaRedlock extends BeanRedlockBase<
  TypeRedlockLockResource,
  TypeRedlockLockIsolateResource
> {}
