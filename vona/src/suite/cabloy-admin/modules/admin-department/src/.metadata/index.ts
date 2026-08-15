// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore,IModelRelationBelongsTo } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/department.tsx';
export * from '../entity/departmentMembership.tsx';
import type { IEntityOptionsDepartment } from '../entity/department.tsx';
import type { IEntityOptionsDepartmentMembership } from '../entity/departmentMembership.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'admin-department:department': IEntityOptionsDepartment;
'admin-department:departmentMembership': IEntityOptionsDepartmentMembership;
    }

  
}
declare module 'vona-module-admin-department' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityDepartment } from '../entity/department.tsx';
import type { EntityDepartmentMembership } from '../entity/departmentMembership.tsx';
export interface IModuleEntity {
  'department': EntityDepartmentMeta;
'departmentMembership': EntityDepartmentMembershipMeta;
}
/** entity: end */
/** entity: begin */
export type EntityDepartmentTableName = 'adminDepartment';
export type EntityDepartmentMembershipTableName = 'adminDepartmentMembership';
export type EntityDepartmentMeta=TypeEntityMeta<EntityDepartment,EntityDepartmentTableName>;
export type EntityDepartmentMembershipMeta=TypeEntityMeta<EntityDepartmentMembership,EntityDepartmentMembershipTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'adminDepartment': EntityDepartmentMeta;
'adminDepartmentMembership': EntityDepartmentMembershipMeta;
  }
}
declare module 'vona-module-admin-department' {
  
    export interface IEntityOptionsDepartment {
      fields?: TypeEntityOptionsFields<EntityDepartment, IEntityOptionsDepartment[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsDepartmentMembership {
      fields?: TypeEntityOptionsFields<EntityDepartmentMembership, IEntityOptionsDepartmentMembership[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/department.ts';
export * from '../model/departmentMembership.ts';
import type { IModelOptionsDepartment } from '../model/department.ts';
import type { IModelOptionsDepartmentMembership } from '../model/departmentMembership.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'admin-department:department': IModelOptionsDepartment;
'admin-department:departmentMembership': IModelOptionsDepartmentMembership;
    }

  
}
declare module 'vona-module-admin-department' {
  
        export interface ModelDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface ModelDepartment {
            get $beanFullName(): 'admin-department.model.department';
            get $onionName(): 'admin-department:department';
            get $onionOptions(): IModelOptionsDepartment;
          }

        export interface ModelDepartmentMembership {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface ModelDepartmentMembership {
            get $beanFullName(): 'admin-department.model.departmentMembership';
            get $onionName(): 'admin-department:departmentMembership';
            get $onionOptions(): IModelOptionsDepartmentMembership;
          } 
}
/** model: end */
/** model: begin */
import type { ModelDepartment } from '../model/department.ts';
import type { ModelDepartmentMembership } from '../model/departmentMembership.ts';
export interface IModuleModel {
  'department': ModelDepartment;
'departmentMembership': ModelDepartmentMembership;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-department.model.department': ModelDepartment;
'admin-department.model.departmentMembership': ModelDepartmentMembership;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-admin-department' {
  export interface IModelOptionsDepartment {
        relations: {
          parent: IModelRelationBelongsTo<'admin-department:department', 'admin-department:department', false, 'id'|'name'>;
        };
      }
  export interface ModelDepartment {
      [SymbolKeyEntity]: EntityDepartment;
      [SymbolKeyEntityMeta]: EntityDepartmentMeta;
      [SymbolKeyModelOptions]: IModelOptionsDepartment;
      get<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(where: TypeModelWhere<EntityDepartment>, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(where: TypeModelWhere<EntityDepartment>, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
      mget<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityDepartment, ModelDepartment, T>>;
      select<T extends IModelSelectParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T>[]>;
      insert<T extends IModelInsertOptions<EntityDepartment,ModelDepartment>>(data?: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityDepartment,ModelDepartment>>(items: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityDepartment,ModelDepartment>>(data: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityDepartment,ModelDepartment>>(items: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>[]>;
      delete<T extends IModelDeleteOptions<EntityDepartment,ModelDepartment>>(where?: TypeModelWhere<EntityDepartment>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityDepartment,ModelDepartment>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityDepartment,ModelDepartment>>(data?: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityDepartment,ModelDepartment>>(items: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>[]>;
      count<T extends IModelSelectCountParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityDepartment, T>[]>;
      getById<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityDepartment,ModelDepartment>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartment,ModelDepartment, T>>;
deleteById<T extends IModelDeleteOptions<EntityDepartment,ModelDepartment>>(id: TableIdentity, options?: T): Promise<void>;
getByName<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
getByNameEqI<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(name?: string, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
selectByName<T extends IModelSelectParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T>[]>;
selectByNameEqI<T extends IModelSelectParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(name?: string, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T>[]>;
getByEnabled<T extends IModelGetOptions<EntityDepartment,ModelDepartment>>(enabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T> | undefined>;
selectByEnabled<T extends IModelSelectParams<EntityDepartment,ModelDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(enabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartment, ModelDepartment, T>[]>;
    }
export interface ModelDepartmentMembership {
      [SymbolKeyEntity]: EntityDepartmentMembership;
      [SymbolKeyEntityMeta]: EntityDepartmentMembershipMeta;
      [SymbolKeyModelOptions]: IModelOptionsDepartmentMembership;
      get<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(where: TypeModelWhere<EntityDepartmentMembership>, options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(where: TypeModelWhere<EntityDepartmentMembership>, options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T> | undefined>;
      mget<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityDepartmentMembership, ModelDepartmentMembership, T>>;
      select<T extends IModelSelectParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T>[]>;
      insert<T extends IModelInsertOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(data?: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(items: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(data: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(items: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>[]>;
      delete<T extends IModelDeleteOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(where?: TypeModelWhere<EntityDepartmentMembership>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(data?: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(items: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>[]>;
      count<T extends IModelSelectCountParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityDepartmentMembership, T>[]>;
      getById<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>, options?: T): Promise<TypeModelMutateRelationData<EntityDepartmentMembership,ModelDepartmentMembership, T>>;
deleteById<T extends IModelDeleteOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(id: TableIdentity, options?: T): Promise<void>;
getByEnabled<T extends IModelGetOptions<EntityDepartmentMembership,ModelDepartmentMembership>>(enabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T> | undefined>;
selectByEnabled<T extends IModelSelectParams<EntityDepartmentMembership,ModelDepartmentMembership,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(enabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityDepartmentMembership, ModelDepartmentMembership, T>[]>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'admin-department:department': ModelDepartment;
'admin-department:departmentMembership': ModelDepartmentMembership;
  }
}
/** model: end */
/** service: begin */
export * from '../service/department.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'admin-department:department': never;
    }

  
}
declare module 'vona-module-admin-department' {
  
        export interface ServiceDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface ServiceDepartment {
            get $beanFullName(): 'admin-department.service.department';
            get $onionName(): 'admin-department:department';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceDepartment } from '../service/department.ts';
export interface IModuleService {
  'department': ServiceDepartment;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-department.service.department': ServiceDepartment;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.redlock.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'admin-department:index': IMetaOptionsIndex;
'admin-department:redlock': never;
'admin-department:version': never;
    }

  
}
declare module 'vona-module-admin-department' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface MetaIndex {
            get $beanFullName(): 'admin-department.meta.index';
            get $onionName(): 'admin-department:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'admin-department.meta.redlock';
            get $onionName(): 'admin-department:redlock';
            
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface MetaVersion {
            get $beanFullName(): 'admin-department.meta.version';
            get $onionName(): 'admin-department:version';
            
          } 
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** dto: begin */
export * from '../dto/departmentActivation.ts';
export * from '../dto/departmentBase.tsx';
export * from '../dto/departmentCreate.tsx';
export * from '../dto/departmentManagerUpdate.ts';
export * from '../dto/departmentMembershipCreate.ts';
export * from '../dto/departmentMembershipDelete.ts';
export * from '../dto/departmentMembershipItem.ts';
export * from '../dto/departmentMembershipPrimary.ts';
export * from '../dto/departmentMembershipSelectRes.ts';
export * from '../dto/departmentMembershipSummary.ts';
export * from '../dto/departmentMembershipUpdate.ts';
export * from '../dto/departmentMove.ts';
export * from '../dto/departmentReorder.ts';
export * from '../dto/departmentSelectReq.tsx';
export * from '../dto/departmentSelectRes.tsx';
export * from '../dto/departmentSelectResItem.tsx';
export * from '../dto/departmentTree.ts';
export * from '../dto/departmentUpdate.tsx';
export * from '../dto/departmentUserSummary.ts';
export * from '../dto/departmentView.tsx';
import type { IDtoOptionsDepartmentActivation } from '../dto/departmentActivation.ts';
import type { IDtoOptionsDepartmentBase } from '../dto/departmentBase.tsx';
import type { IDtoOptionsDepartmentCreate } from '../dto/departmentCreate.tsx';
import type { IDtoOptionsDepartmentManagerUpdate } from '../dto/departmentManagerUpdate.ts';
import type { IDtoOptionsDepartmentMembershipCreate } from '../dto/departmentMembershipCreate.ts';
import type { IDtoOptionsDepartmentMembershipDelete } from '../dto/departmentMembershipDelete.ts';
import type { IDtoOptionsDepartmentMembershipItem } from '../dto/departmentMembershipItem.ts';
import type { IDtoOptionsDepartmentMembershipPrimary } from '../dto/departmentMembershipPrimary.ts';
import type { IDtoOptionsDepartmentMembershipSelectRes } from '../dto/departmentMembershipSelectRes.ts';
import type { IDtoOptionsDepartmentMembershipSummary } from '../dto/departmentMembershipSummary.ts';
import type { IDtoOptionsDepartmentMembershipUpdate } from '../dto/departmentMembershipUpdate.ts';
import type { IDtoOptionsDepartmentMove } from '../dto/departmentMove.ts';
import type { IDtoOptionsDepartmentReorder } from '../dto/departmentReorder.ts';
import type { IDtoOptionsDepartmentSelectReq } from '../dto/departmentSelectReq.tsx';
import type { IDtoOptionsDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
import type { IDtoOptionsDepartmentSelectResItem } from '../dto/departmentSelectResItem.tsx';
import type { IDtoOptionsDepartmentTreeItem } from '../dto/departmentTree.ts';
import type { IDtoOptionsDepartmentUpdate } from '../dto/departmentUpdate.tsx';
import type { IDtoOptionsDepartmentUserSummary } from '../dto/departmentUserSummary.ts';
import type { IDtoOptionsDepartmentView } from '../dto/departmentView.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'admin-department:departmentActivation': IDtoOptionsDepartmentActivation;
'admin-department:departmentBase': IDtoOptionsDepartmentBase;
'admin-department:departmentCreate': IDtoOptionsDepartmentCreate;
'admin-department:departmentManagerUpdate': IDtoOptionsDepartmentManagerUpdate;
'admin-department:departmentMembershipCreate': IDtoOptionsDepartmentMembershipCreate;
'admin-department:departmentMembershipDelete': IDtoOptionsDepartmentMembershipDelete;
'admin-department:departmentMembershipItem': IDtoOptionsDepartmentMembershipItem;
'admin-department:departmentMembershipPrimary': IDtoOptionsDepartmentMembershipPrimary;
'admin-department:departmentMembershipSelectRes': IDtoOptionsDepartmentMembershipSelectRes;
'admin-department:departmentMembershipSummary': IDtoOptionsDepartmentMembershipSummary;
'admin-department:departmentMembershipUpdate': IDtoOptionsDepartmentMembershipUpdate;
'admin-department:departmentMove': IDtoOptionsDepartmentMove;
'admin-department:departmentReorder': IDtoOptionsDepartmentReorder;
'admin-department:departmentSelectReq': IDtoOptionsDepartmentSelectReq;
'admin-department:departmentSelectRes': IDtoOptionsDepartmentSelectRes;
'admin-department:departmentSelectResItem': IDtoOptionsDepartmentSelectResItem;
'admin-department:departmentTree': IDtoOptionsDepartmentTreeItem;
'admin-department:departmentUpdate': IDtoOptionsDepartmentUpdate;
'admin-department:departmentUserSummary': IDtoOptionsDepartmentUserSummary;
'admin-department:departmentView': IDtoOptionsDepartmentView;
    }

  
}
declare module 'vona-module-admin-department' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoDepartmentActivation } from '../dto/departmentActivation.ts';
import type { DtoDepartmentBase } from '../dto/departmentBase.tsx';
import type { DtoDepartmentCreate } from '../dto/departmentCreate.tsx';
import type { DtoDepartmentManagerUpdate } from '../dto/departmentManagerUpdate.ts';
import type { DtoDepartmentMembershipCreate } from '../dto/departmentMembershipCreate.ts';
import type { DtoDepartmentMembershipDelete } from '../dto/departmentMembershipDelete.ts';
import type { DtoDepartmentMembershipItem } from '../dto/departmentMembershipItem.ts';
import type { DtoDepartmentMembershipPrimary } from '../dto/departmentMembershipPrimary.ts';
import type { DtoDepartmentMembershipSelectRes } from '../dto/departmentMembershipSelectRes.ts';
import type { DtoDepartmentMembershipSummary } from '../dto/departmentMembershipSummary.ts';
import type { DtoDepartmentMembershipUpdate } from '../dto/departmentMembershipUpdate.ts';
import type { DtoDepartmentMove } from '../dto/departmentMove.ts';
import type { DtoDepartmentReorder } from '../dto/departmentReorder.ts';
import type { DtoDepartmentSelectReq } from '../dto/departmentSelectReq.tsx';
import type { DtoDepartmentSelectRes } from '../dto/departmentSelectRes.tsx';
import type { DtoDepartmentSelectResItem } from '../dto/departmentSelectResItem.tsx';
import type { DtoDepartmentTree } from '../dto/departmentTree.ts';
import type { DtoDepartmentUpdate } from '../dto/departmentUpdate.tsx';
import type { DtoDepartmentUserSummary } from '../dto/departmentUserSummary.ts';
import type { DtoDepartmentView } from '../dto/departmentView.tsx';
declare module 'vona-module-admin-department' {
  
    export interface IDtoOptionsDepartmentActivation {
      fields?: TypeEntityOptionsFields<DtoDepartmentActivation, IDtoOptionsDepartmentActivation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentBase {
      fields?: TypeEntityOptionsFields<DtoDepartmentBase, IDtoOptionsDepartmentBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentCreate {
      fields?: TypeEntityOptionsFields<DtoDepartmentCreate, IDtoOptionsDepartmentCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentManagerUpdate {
      fields?: TypeEntityOptionsFields<DtoDepartmentManagerUpdate, IDtoOptionsDepartmentManagerUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipCreate {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipCreate, IDtoOptionsDepartmentMembershipCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipDelete {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipDelete, IDtoOptionsDepartmentMembershipDelete[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipItem {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipItem, IDtoOptionsDepartmentMembershipItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipPrimary {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipPrimary, IDtoOptionsDepartmentMembershipPrimary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipSelectRes {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipSelectRes, IDtoOptionsDepartmentMembershipSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipSummary {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipSummary, IDtoOptionsDepartmentMembershipSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMembershipUpdate {
      fields?: TypeEntityOptionsFields<DtoDepartmentMembershipUpdate, IDtoOptionsDepartmentMembershipUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentMove {
      fields?: TypeEntityOptionsFields<DtoDepartmentMove, IDtoOptionsDepartmentMove[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentReorder {
      fields?: TypeEntityOptionsFields<DtoDepartmentReorder, IDtoOptionsDepartmentReorder[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentSelectReq {
      fields?: TypeEntityOptionsFields<DtoDepartmentSelectReq, IDtoOptionsDepartmentSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentSelectRes {
      fields?: TypeEntityOptionsFields<DtoDepartmentSelectRes, IDtoOptionsDepartmentSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentSelectResItem {
      fields?: TypeEntityOptionsFields<DtoDepartmentSelectResItem, IDtoOptionsDepartmentSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentTree {
      fields?: TypeEntityOptionsFields<DtoDepartmentTree, IDtoOptionsDepartmentTree[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentUpdate {
      fields?: TypeEntityOptionsFields<DtoDepartmentUpdate, IDtoOptionsDepartmentUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentUserSummary {
      fields?: TypeEntityOptionsFields<DtoDepartmentUserSummary, IDtoOptionsDepartmentUserSummary[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsDepartmentView {
      fields?: TypeEntityOptionsFields<DtoDepartmentView, IDtoOptionsDepartmentView[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/department.ts';
import type { IControllerOptionsDepartment } from '../controller/department.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'admin-department:department': IControllerOptionsDepartment;
    }

  
}
declare module 'vona-module-admin-department' {
  
        export interface ControllerDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface ControllerDepartment {
            get $beanFullName(): 'admin-department.controller.department';
            get $onionName(): 'admin-department:department';
            get $onionOptions(): IControllerOptionsDepartment;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerDepartment } from '../controller/department.ts';
declare module 'vona-module-admin-department' {
  
    export interface IControllerOptionsDepartment {
      actions?: TypeControllerOptionsActions<ControllerDepartment>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/admin/department': undefined;
'/admin/department/:departmentId/memberships': undefined;
    }
export interface IApiPathGetRecord{
        '/admin/department': undefined;
'/admin/department/tree': undefined;
'/admin/department/:id': undefined;
'/admin/department/:departmentId/memberships': undefined;
    }
export interface IApiPathPatchRecord{
        '/admin/department/:id': undefined;
'/admin/department/:departmentId/memberships/:membershipId': undefined;
    }
export interface IApiPathDeleteRecord{
        '/admin/department/:id': undefined;
'/admin/department/:departmentId/memberships/:membershipId': undefined;
    }
export interface IApiPathPutRecord{
        '/admin/department/:departmentId/memberships/:membershipId/primary': undefined;
'/admin/department/:id/manager': undefined;
'/admin/department/:id/move': undefined;
'/admin/department/:id/reorder': undefined;
'/admin/department/:id/activation': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'admin-department:department': never;
    }
  }
  
/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.department.ts';
import type { ISsrMenuOptionsDepartment } from '../bean/ssrMenu.department.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrMenuRecord {
      'admin-department:department': ISsrMenuOptionsDepartment;
    }

  
}
declare module 'vona-module-admin-department' {
  
        export interface SsrMenuDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminDepartment;
        }

          export interface SsrMenuDepartment {
            get $beanFullName(): 'admin-department.ssrMenu.department';
            get $onionName(): 'admin-department:department';
            get $onionOptions(): ISsrMenuOptionsDepartment;
          } 
}
/** ssrMenu: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** error: begin */
export * from '../config/errors.ts';
import type { errors } from '../config/errors.ts';
/** error: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleErrors, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAdminDepartment extends BeanScopeBase {}

export interface ScopeModuleAdminDepartment {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
redlock: MetaRedlock;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-department': ScopeModuleAdminDepartment;
  }

  export interface IBeanScopeContainer {
    adminDepartment: ScopeModuleAdminDepartment;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-department': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'admin-department': typeof errors;
  }
}
/** scope: end */
