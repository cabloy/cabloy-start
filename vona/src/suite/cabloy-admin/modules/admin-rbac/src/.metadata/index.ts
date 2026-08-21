// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/policyRevision.tsx';
export * from '../entity/rbacGrant.tsx';
export * from '../entity/rbacGrantDepartment.tsx';
import type { IEntityOptionsPolicyRevision } from '../entity/policyRevision.tsx';
import type { IEntityOptionsRbacGrant } from '../entity/rbacGrant.tsx';
import type { IEntityOptionsRbacGrantDepartment } from '../entity/rbacGrantDepartment.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IEntityRecord {
      'admin-rbac:policyRevision': IEntityOptionsPolicyRevision;
'admin-rbac:rbacGrant': IEntityOptionsRbacGrant;
'admin-rbac:rbacGrantDepartment': IEntityOptionsRbacGrantDepartment;
    }

  
}
declare module 'vona-module-admin-rbac' {
   
}
/** entity: end */
/** entity: begin */
import type { EntityPolicyRevision } from '../entity/policyRevision.tsx';
import type { EntityRbacGrant } from '../entity/rbacGrant.tsx';
import type { EntityRbacGrantDepartment } from '../entity/rbacGrantDepartment.tsx';
export interface IModuleEntity {
  'policyRevision': EntityPolicyRevisionMeta;
'rbacGrant': EntityRbacGrantMeta;
'rbacGrantDepartment': EntityRbacGrantDepartmentMeta;
}
/** entity: end */
/** entity: begin */
export type EntityPolicyRevisionTableName = 'adminRbacPolicyRevision';
export type EntityRbacGrantTableName = 'adminRbacRbacGrant';
export type EntityRbacGrantDepartmentTableName = 'adminRbacRbacGrantDepartment';
export type EntityPolicyRevisionMeta=TypeEntityMeta<EntityPolicyRevision,EntityPolicyRevisionTableName>;
export type EntityRbacGrantMeta=TypeEntityMeta<EntityRbacGrant,EntityRbacGrantTableName>;
export type EntityRbacGrantDepartmentMeta=TypeEntityMeta<EntityRbacGrantDepartment,EntityRbacGrantDepartmentTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'adminRbacPolicyRevision': EntityPolicyRevisionMeta;
'adminRbacRbacGrant': EntityRbacGrantMeta;
'adminRbacRbacGrantDepartment': EntityRbacGrantDepartmentMeta;
  }
}
declare module 'vona-module-admin-rbac' {
  
    export interface IEntityOptionsPolicyRevision {
      fields?: TypeEntityOptionsFields<EntityPolicyRevision, IEntityOptionsPolicyRevision[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRbacGrant {
      fields?: TypeEntityOptionsFields<EntityRbacGrant, IEntityOptionsRbacGrant[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRbacGrantDepartment {
      fields?: TypeEntityOptionsFields<EntityRbacGrantDepartment, IEntityOptionsRbacGrantDepartment[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/policyRevision.ts';
export * from '../model/rbacGrant.ts';
export * from '../model/rbacGrantDepartment.ts';
import type { IModelOptionsPolicyRevision } from '../model/policyRevision.ts';
import type { IModelOptionsRbacGrant } from '../model/rbacGrant.ts';
import type { IModelOptionsRbacGrantDepartment } from '../model/rbacGrantDepartment.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {
  
    export interface IModelRecord {
      'admin-rbac:policyRevision': IModelOptionsPolicyRevision;
'admin-rbac:rbacGrant': IModelOptionsRbacGrant;
'admin-rbac:rbacGrantDepartment': IModelOptionsRbacGrantDepartment;
    }

  
}
declare module 'vona-module-admin-rbac' {
  
        export interface ModelPolicyRevision {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ModelPolicyRevision {
            get $beanFullName(): 'admin-rbac.model.policyRevision';
            get $onionName(): 'admin-rbac:policyRevision';
            get $onionOptions(): IModelOptionsPolicyRevision;
          }

        export interface ModelRbacGrant {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ModelRbacGrant {
            get $beanFullName(): 'admin-rbac.model.rbacGrant';
            get $onionName(): 'admin-rbac:rbacGrant';
            get $onionOptions(): IModelOptionsRbacGrant;
          }

        export interface ModelRbacGrantDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ModelRbacGrantDepartment {
            get $beanFullName(): 'admin-rbac.model.rbacGrantDepartment';
            get $onionName(): 'admin-rbac:rbacGrantDepartment';
            get $onionOptions(): IModelOptionsRbacGrantDepartment;
          } 
}
/** model: end */
/** model: begin */
import type { ModelPolicyRevision } from '../model/policyRevision.ts';
import type { ModelRbacGrant } from '../model/rbacGrant.ts';
import type { ModelRbacGrantDepartment } from '../model/rbacGrantDepartment.ts';
export interface IModuleModel {
  'policyRevision': ModelPolicyRevision;
'rbacGrant': ModelRbacGrant;
'rbacGrantDepartment': ModelRbacGrantDepartment;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-rbac.model.policyRevision': ModelPolicyRevision;
'admin-rbac.model.rbacGrant': ModelRbacGrant;
'admin-rbac.model.rbacGrantDepartment': ModelRbacGrantDepartment;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-admin-rbac' {
  
  export interface ModelPolicyRevision {
      [SymbolKeyEntity]: EntityPolicyRevision;
      [SymbolKeyEntityMeta]: EntityPolicyRevisionMeta;
      [SymbolKeyModelOptions]: IModelOptionsPolicyRevision;
      get<T extends IModelGetOptions<EntityPolicyRevision,ModelPolicyRevision>>(where: TypeModelWhere<EntityPolicyRevision>, options?: T): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityPolicyRevision,ModelPolicyRevision>>(where: TypeModelWhere<EntityPolicyRevision>, options?: T): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityPolicyRevision,ModelPolicyRevision>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T> | undefined>;
      mget<T extends IModelGetOptions<EntityPolicyRevision,ModelPolicyRevision>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityPolicyRevision, ModelPolicyRevision, T>>;
      select<T extends IModelSelectParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T>[]>;
      insert<T extends IModelInsertOptions<EntityPolicyRevision,ModelPolicyRevision>>(data?: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityPolicyRevision,ModelPolicyRevision>>(items: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityPolicyRevision,ModelPolicyRevision>>(data: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityPolicyRevision,ModelPolicyRevision>>(items: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>[]>;
      delete<T extends IModelDeleteOptions<EntityPolicyRevision,ModelPolicyRevision>>(where?: TypeModelWhere<EntityPolicyRevision>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityPolicyRevision,ModelPolicyRevision>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityPolicyRevision,ModelPolicyRevision>>(data?: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityPolicyRevision,ModelPolicyRevision>>(items: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>[]>;
      count<T extends IModelSelectCountParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityPolicyRevision,ModelPolicyRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityPolicyRevision, T>[]>;
      getById<T extends IModelGetOptions<EntityPolicyRevision,ModelPolicyRevision>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityPolicyRevision, ModelPolicyRevision, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityPolicyRevision,ModelPolicyRevision>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityPolicyRevision,ModelPolicyRevision, T>>;
deleteById<T extends IModelDeleteOptions<EntityPolicyRevision,ModelPolicyRevision>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRbacGrant {
      [SymbolKeyEntity]: EntityRbacGrant;
      [SymbolKeyEntityMeta]: EntityRbacGrantMeta;
      [SymbolKeyModelOptions]: IModelOptionsRbacGrant;
      get<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(where: TypeModelWhere<EntityRbacGrant>, options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(where: TypeModelWhere<EntityRbacGrant>, options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRbacGrant, ModelRbacGrant, T>>;
      select<T extends IModelSelectParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T>[]>;
      insert<T extends IModelInsertOptions<EntityRbacGrant,ModelRbacGrant>>(data?: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRbacGrant,ModelRbacGrant>>(items: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRbacGrant,ModelRbacGrant>>(data: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRbacGrant,ModelRbacGrant>>(items: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRbacGrant,ModelRbacGrant>>(where?: TypeModelWhere<EntityRbacGrant>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRbacGrant,ModelRbacGrant>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRbacGrant,ModelRbacGrant>>(data?: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRbacGrant,ModelRbacGrant>>(items: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>[]>;
      count<T extends IModelSelectCountParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRbacGrant, T>[]>;
      getById<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRbacGrant,ModelRbacGrant>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrant,ModelRbacGrant, T>>;
deleteById<T extends IModelDeleteOptions<EntityRbacGrant,ModelRbacGrant>>(id: TableIdentity, options?: T): Promise<void>;
getByEnabled<T extends IModelGetOptions<EntityRbacGrant,ModelRbacGrant>>(enabled?: boolean, options?: T): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T> | undefined>;
selectByEnabled<T extends IModelSelectParams<EntityRbacGrant,ModelRbacGrant,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(enabled?: boolean, params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRbacGrant, ModelRbacGrant, T>[]>;
    }
export interface ModelRbacGrantDepartment {
      [SymbolKeyEntity]: EntityRbacGrantDepartment;
      [SymbolKeyEntityMeta]: EntityRbacGrantDepartmentMeta;
      [SymbolKeyModelOptions]: IModelOptionsRbacGrantDepartment;
      get<T extends IModelGetOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(where: TypeModelWhere<EntityRbacGrantDepartment>, options?: T): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(where: TypeModelWhere<EntityRbacGrantDepartment>, options?: T): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T>>;
      select<T extends IModelSelectParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T>[]>;
      insert<T extends IModelInsertOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(data?: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(items: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(data: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(items: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(where?: TypeModelWhere<EntityRbacGrantDepartment>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(data?: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(items: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>[]>;
      count<T extends IModelSelectCountParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRbacGrantDepartment,ModelRbacGrantDepartment,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRbacGrantDepartment, T>[]>;
      getById<T extends IModelGetOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRbacGrantDepartment, ModelRbacGrantDepartment, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRbacGrantDepartment,ModelRbacGrantDepartment, T>>;
deleteById<T extends IModelDeleteOptions<EntityRbacGrantDepartment,ModelRbacGrantDepartment>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'admin-rbac:policyRevision': ModelPolicyRevision;
'admin-rbac:rbacGrant': ModelRbacGrant;
'admin-rbac:rbacGrantDepartment': ModelRbacGrantDepartment;
  }
}
/** model: end */
/** service: begin */
export * from '../service/rbacGrant.ts';
export * from '../service/rbacGrantDepartment.ts';
export * from '../service/rbacPolicy.ts';
export * from '../service/rbacPolicyProjection.ts';
export * from '../service/rbacPolicyRevision.ts';
export * from '../service/rbacScopeAdapter.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'admin-rbac:rbacGrant': never;
'admin-rbac:rbacGrantDepartment': never;
'admin-rbac:rbacPolicy': never;
'admin-rbac:rbacPolicyProjection': never;
'admin-rbac:rbacPolicyRevision': never;
'admin-rbac:rbacScopeAdapter': never;
    }

  
}
declare module 'vona-module-admin-rbac' {
  
        export interface ServiceRbacGrant {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacGrant {
            get $beanFullName(): 'admin-rbac.service.rbacGrant';
            get $onionName(): 'admin-rbac:rbacGrant';
          }

        export interface ServiceRbacGrantDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacGrantDepartment {
            get $beanFullName(): 'admin-rbac.service.rbacGrantDepartment';
            get $onionName(): 'admin-rbac:rbacGrantDepartment';
          }

        export interface ServiceRbacPolicy {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacPolicy {
            get $beanFullName(): 'admin-rbac.service.rbacPolicy';
            get $onionName(): 'admin-rbac:rbacPolicy';
          }

        export interface ServiceRbacPolicyProjection {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacPolicyProjection {
            get $beanFullName(): 'admin-rbac.service.rbacPolicyProjection';
            get $onionName(): 'admin-rbac:rbacPolicyProjection';
          }

        export interface ServiceRbacPolicyRevision {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacPolicyRevision {
            get $beanFullName(): 'admin-rbac.service.rbacPolicyRevision';
            get $onionName(): 'admin-rbac:rbacPolicyRevision';
          }

        export interface ServiceRbacScopeAdapter {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ServiceRbacScopeAdapter {
            get $beanFullName(): 'admin-rbac.service.rbacScopeAdapter';
            get $onionName(): 'admin-rbac:rbacScopeAdapter';
          } 
}
/** service: end */
/** service: begin */
import type { ServiceRbacGrant } from '../service/rbacGrant.ts';
import type { ServiceRbacGrantDepartment } from '../service/rbacGrantDepartment.ts';
import type { ServiceRbacPolicy } from '../service/rbacPolicy.ts';
import type { ServiceRbacPolicyProjection } from '../service/rbacPolicyProjection.ts';
import type { ServiceRbacPolicyRevision } from '../service/rbacPolicyRevision.ts';
import type { ServiceRbacScopeAdapter } from '../service/rbacScopeAdapter.ts';
export interface IModuleService {
  'rbacGrant': ServiceRbacGrant;
'rbacGrantDepartment': ServiceRbacGrantDepartment;
'rbacPolicy': ServiceRbacPolicy;
'rbacPolicyProjection': ServiceRbacPolicyProjection;
'rbacPolicyRevision': ServiceRbacPolicyRevision;
'rbacScopeAdapter': ServiceRbacScopeAdapter;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-rbac.service.rbacGrant': ServiceRbacGrant;
'admin-rbac.service.rbacGrantDepartment': ServiceRbacGrantDepartment;
'admin-rbac.service.rbacPolicy': ServiceRbacPolicy;
'admin-rbac.service.rbacPolicyProjection': ServiceRbacPolicyProjection;
'admin-rbac.service.rbacPolicyRevision': ServiceRbacPolicyRevision;
'admin-rbac.service.rbacScopeAdapter': ServiceRbacScopeAdapter;
  }
}
/** service: end */
/** eventListener: begin */
export * from '../bean/eventListener.policyInvalidated.ts';
export * from '../bean/eventListener.policyResolver.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'admin-rbac:policyInvalidated': IDecoratorEventListenerOptions;
'admin-rbac:policyResolver': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-admin-rbac' {
  
        export interface EventListenerPolicyInvalidated {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface EventListenerPolicyInvalidated {
            get $beanFullName(): 'admin-rbac.eventListener.policyInvalidated';
            get $onionName(): 'admin-rbac:policyInvalidated';
            get $onionOptions(): IDecoratorEventListenerOptions;
          }

        export interface EventListenerPolicyResolver {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface EventListenerPolicyResolver {
            get $beanFullName(): 'admin-rbac.eventListener.policyResolver';
            get $onionName(): 'admin-rbac:policyResolver';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** meta: begin */
export * from '../bean/meta.index.ts';
export * from '../bean/meta.version.ts';
import type { IMetaOptionsIndex } from 'vona-module-a-index';
import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'admin-rbac:index': IMetaOptionsIndex;
'admin-rbac:version': never;
    }

  
}
declare module 'vona-module-admin-rbac' {
  
        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface MetaIndex {
            get $beanFullName(): 'admin-rbac.meta.index';
            get $onionName(): 'admin-rbac:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface MetaVersion {
            get $beanFullName(): 'admin-rbac.meta.version';
            get $onionName(): 'admin-rbac:version';
          } 
}
/** meta: end */
/** dto: begin */
export * from '../dto/rbacGrantCreate.tsx';
export * from '../dto/rbacGrantDepartmentCreate.tsx';
export * from '../dto/rbacGrantDepartmentSelectReq.tsx';
export * from '../dto/rbacGrantDepartmentSelectRes.tsx';
export * from '../dto/rbacGrantDepartmentSelectResItem.tsx';
export * from '../dto/rbacGrantDepartmentUpdate.tsx';
export * from '../dto/rbacGrantDepartmentView.tsx';
export * from '../dto/rbacGrantSelectReq.tsx';
export * from '../dto/rbacGrantSelectRes.tsx';
export * from '../dto/rbacGrantSelectResItem.tsx';
export * from '../dto/rbacGrantUpdate.tsx';
export * from '../dto/rbacGrantView.tsx';
export * from '../dto/rbacPolicyCatalogRes.ts';
export * from '../dto/rbacPolicyCatalogResItem.ts';
export * from '../dto/rbacPolicyRoleConfigurationAction.ts';
export * from '../dto/rbacPolicyRoleConfigurationRes.ts';
export * from '../dto/rbacPolicyRoleConfigurationScope.ts';
import type { IDtoOptionsRbacGrantCreate } from '../dto/rbacGrantCreate.tsx';
import type { IDtoOptionsRbacGrantDepartmentCreate } from '../dto/rbacGrantDepartmentCreate.tsx';
import type { IDtoOptionsRbacGrantDepartmentSelectReq } from '../dto/rbacGrantDepartmentSelectReq.tsx';
import type { IDtoOptionsRbacGrantDepartmentSelectRes } from '../dto/rbacGrantDepartmentSelectRes.tsx';
import type { IDtoOptionsRbacGrantDepartmentSelectResItem } from '../dto/rbacGrantDepartmentSelectResItem.tsx';
import type { IDtoOptionsRbacGrantDepartmentUpdate } from '../dto/rbacGrantDepartmentUpdate.tsx';
import type { IDtoOptionsRbacGrantDepartmentView } from '../dto/rbacGrantDepartmentView.tsx';
import type { IDtoOptionsRbacGrantSelectReq } from '../dto/rbacGrantSelectReq.tsx';
import type { IDtoOptionsRbacGrantSelectRes } from '../dto/rbacGrantSelectRes.tsx';
import type { IDtoOptionsRbacGrantSelectResItem } from '../dto/rbacGrantSelectResItem.tsx';
import type { IDtoOptionsRbacGrantUpdate } from '../dto/rbacGrantUpdate.tsx';
import type { IDtoOptionsRbacGrantView } from '../dto/rbacGrantView.tsx';
import type { IDtoOptionsRbacPolicyCatalogRes } from '../dto/rbacPolicyCatalogRes.ts';
import type { IDtoOptionsRbacPolicyCatalogResItem } from '../dto/rbacPolicyCatalogResItem.ts';
import type { IDtoOptionsRbacPolicyRoleConfigurationAction } from '../dto/rbacPolicyRoleConfigurationAction.ts';
import type { IDtoOptionsRbacPolicyRoleConfigurationRes } from '../dto/rbacPolicyRoleConfigurationRes.ts';
import type { IDtoOptionsRbacPolicyRoleConfigurationScope } from '../dto/rbacPolicyRoleConfigurationScope.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'admin-rbac:rbacGrantCreate': IDtoOptionsRbacGrantCreate;
'admin-rbac:rbacGrantDepartmentCreate': IDtoOptionsRbacGrantDepartmentCreate;
'admin-rbac:rbacGrantDepartmentSelectReq': IDtoOptionsRbacGrantDepartmentSelectReq;
'admin-rbac:rbacGrantDepartmentSelectRes': IDtoOptionsRbacGrantDepartmentSelectRes;
'admin-rbac:rbacGrantDepartmentSelectResItem': IDtoOptionsRbacGrantDepartmentSelectResItem;
'admin-rbac:rbacGrantDepartmentUpdate': IDtoOptionsRbacGrantDepartmentUpdate;
'admin-rbac:rbacGrantDepartmentView': IDtoOptionsRbacGrantDepartmentView;
'admin-rbac:rbacGrantSelectReq': IDtoOptionsRbacGrantSelectReq;
'admin-rbac:rbacGrantSelectRes': IDtoOptionsRbacGrantSelectRes;
'admin-rbac:rbacGrantSelectResItem': IDtoOptionsRbacGrantSelectResItem;
'admin-rbac:rbacGrantUpdate': IDtoOptionsRbacGrantUpdate;
'admin-rbac:rbacGrantView': IDtoOptionsRbacGrantView;
'admin-rbac:rbacPolicyCatalogRes': IDtoOptionsRbacPolicyCatalogRes;
'admin-rbac:rbacPolicyCatalogResItem': IDtoOptionsRbacPolicyCatalogResItem;
'admin-rbac:rbacPolicyRoleConfigurationAction': IDtoOptionsRbacPolicyRoleConfigurationAction;
'admin-rbac:rbacPolicyRoleConfigurationRes': IDtoOptionsRbacPolicyRoleConfigurationRes;
'admin-rbac:rbacPolicyRoleConfigurationScope': IDtoOptionsRbacPolicyRoleConfigurationScope;
    }

  
}
declare module 'vona-module-admin-rbac' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoRbacGrantCreate } from '../dto/rbacGrantCreate.tsx';
import type { DtoRbacGrantDepartmentCreate } from '../dto/rbacGrantDepartmentCreate.tsx';
import type { DtoRbacGrantDepartmentSelectReq } from '../dto/rbacGrantDepartmentSelectReq.tsx';
import type { DtoRbacGrantDepartmentSelectRes } from '../dto/rbacGrantDepartmentSelectRes.tsx';
import type { DtoRbacGrantDepartmentSelectResItem } from '../dto/rbacGrantDepartmentSelectResItem.tsx';
import type { DtoRbacGrantDepartmentUpdate } from '../dto/rbacGrantDepartmentUpdate.tsx';
import type { DtoRbacGrantDepartmentView } from '../dto/rbacGrantDepartmentView.tsx';
import type { DtoRbacGrantSelectReq } from '../dto/rbacGrantSelectReq.tsx';
import type { DtoRbacGrantSelectRes } from '../dto/rbacGrantSelectRes.tsx';
import type { DtoRbacGrantSelectResItem } from '../dto/rbacGrantSelectResItem.tsx';
import type { DtoRbacGrantUpdate } from '../dto/rbacGrantUpdate.tsx';
import type { DtoRbacGrantView } from '../dto/rbacGrantView.tsx';
import type { DtoRbacPolicyCatalogRes } from '../dto/rbacPolicyCatalogRes.ts';
import type { DtoRbacPolicyCatalogResItem } from '../dto/rbacPolicyCatalogResItem.ts';
import type { DtoRbacPolicyRoleConfigurationAction } from '../dto/rbacPolicyRoleConfigurationAction.ts';
import type { DtoRbacPolicyRoleConfigurationRes } from '../dto/rbacPolicyRoleConfigurationRes.ts';
import type { DtoRbacPolicyRoleConfigurationScope } from '../dto/rbacPolicyRoleConfigurationScope.ts';
declare module 'vona-module-admin-rbac' {
  
    export interface IDtoOptionsRbacGrantCreate {
      fields?: TypeEntityOptionsFields<DtoRbacGrantCreate, IDtoOptionsRbacGrantCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentCreate {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentCreate, IDtoOptionsRbacGrantDepartmentCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentSelectReq {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentSelectReq, IDtoOptionsRbacGrantDepartmentSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentSelectRes {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentSelectRes, IDtoOptionsRbacGrantDepartmentSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentSelectResItem {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentSelectResItem, IDtoOptionsRbacGrantDepartmentSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentUpdate {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentUpdate, IDtoOptionsRbacGrantDepartmentUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantDepartmentView {
      fields?: TypeEntityOptionsFields<DtoRbacGrantDepartmentView, IDtoOptionsRbacGrantDepartmentView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantSelectReq {
      fields?: TypeEntityOptionsFields<DtoRbacGrantSelectReq, IDtoOptionsRbacGrantSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantSelectRes {
      fields?: TypeEntityOptionsFields<DtoRbacGrantSelectRes, IDtoOptionsRbacGrantSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantSelectResItem {
      fields?: TypeEntityOptionsFields<DtoRbacGrantSelectResItem, IDtoOptionsRbacGrantSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantUpdate {
      fields?: TypeEntityOptionsFields<DtoRbacGrantUpdate, IDtoOptionsRbacGrantUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacGrantView {
      fields?: TypeEntityOptionsFields<DtoRbacGrantView, IDtoOptionsRbacGrantView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacPolicyCatalogRes {
      fields?: TypeEntityOptionsFields<DtoRbacPolicyCatalogRes, IDtoOptionsRbacPolicyCatalogRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacPolicyCatalogResItem {
      fields?: TypeEntityOptionsFields<DtoRbacPolicyCatalogResItem, IDtoOptionsRbacPolicyCatalogResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacPolicyRoleConfigurationAction {
      fields?: TypeEntityOptionsFields<DtoRbacPolicyRoleConfigurationAction, IDtoOptionsRbacPolicyRoleConfigurationAction[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacPolicyRoleConfigurationRes {
      fields?: TypeEntityOptionsFields<DtoRbacPolicyRoleConfigurationRes, IDtoOptionsRbacPolicyRoleConfigurationRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRbacPolicyRoleConfigurationScope {
      fields?: TypeEntityOptionsFields<DtoRbacPolicyRoleConfigurationScope, IDtoOptionsRbacPolicyRoleConfigurationScope[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/rbacGrant.ts';
export * from '../controller/rbacGrantDepartment.ts';
export * from '../controller/rbacPolicy.ts';
import type { IControllerOptionsRbacGrant } from '../controller/rbacGrant.ts';
import type { IControllerOptionsRbacGrantDepartment } from '../controller/rbacGrantDepartment.ts';
import type { IControllerOptionsRbacPolicy } from '../controller/rbacPolicy.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'admin-rbac:rbacGrant': IControllerOptionsRbacGrant;
'admin-rbac:rbacGrantDepartment': IControllerOptionsRbacGrantDepartment;
'admin-rbac:rbacPolicy': IControllerOptionsRbacPolicy;
    }

  
}
declare module 'vona-module-admin-rbac' {
  
        export interface ControllerRbacGrant {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ControllerRbacGrant {
            get $beanFullName(): 'admin-rbac.controller.rbacGrant';
            get $onionName(): 'admin-rbac:rbacGrant';
            get $onionOptions(): IControllerOptionsRbacGrant;
          }

        export interface ControllerRbacGrantDepartment {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ControllerRbacGrantDepartment {
            get $beanFullName(): 'admin-rbac.controller.rbacGrantDepartment';
            get $onionName(): 'admin-rbac:rbacGrantDepartment';
            get $onionOptions(): IControllerOptionsRbacGrantDepartment;
          }

        export interface ControllerRbacPolicy {
          /** @internal */
          get scope(): ScopeModuleAdminRbac;
        }

          export interface ControllerRbacPolicy {
            get $beanFullName(): 'admin-rbac.controller.rbacPolicy';
            get $onionName(): 'admin-rbac:rbacPolicy';
            get $onionOptions(): IControllerOptionsRbacPolicy;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRbacGrant } from '../controller/rbacGrant.ts';
// @ts-ignore ignore
import type { ControllerRbacGrantDepartment } from '../controller/rbacGrantDepartment.ts';
// @ts-ignore ignore
import type { ControllerRbacPolicy } from '../controller/rbacPolicy.ts';
declare module 'vona-module-admin-rbac' {
  
    export interface IControllerOptionsRbacGrant {
      actions?: TypeControllerOptionsActions<ControllerRbacGrant>;
    }

    export interface IControllerOptionsRbacGrantDepartment {
      actions?: TypeControllerOptionsActions<ControllerRbacGrantDepartment>;
    }

    export interface IControllerOptionsRbacPolicy {
      actions?: TypeControllerOptionsActions<ControllerRbacPolicy>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/admin/rbac/rbacGrant': undefined;
'/admin/rbac/rbacGrantDepartment': undefined;
    }
export interface IApiPathGetRecord{
        '/admin/rbac/rbacGrant': undefined;
'/admin/rbac/rbacGrant/:id': undefined;
'/admin/rbac/rbacGrantDepartment': undefined;
'/admin/rbac/rbacGrantDepartment/:id': undefined;
'/admin/rbac/rbacPolicy/catalog': undefined;
'/admin/rbac/rbacPolicy/roles/:roleId/configuration': undefined;
    }
export interface IApiPathPatchRecord{
        '/admin/rbac/rbacGrant/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/admin/rbac/rbacGrant/:id': undefined;
'/admin/rbac/rbacGrantDepartment/:id': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'admin-rbac:rbacGrant': never;
'admin-rbac:rbacGrantDepartment': never;
    }
  }
  
/** controller: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAdminRbac extends BeanScopeBase {}

export interface ScopeModuleAdminRbac {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-rbac': ScopeModuleAdminRbac;
  }

  export interface IBeanScopeContainer {
    adminRbac: ScopeModuleAdminRbac;
  }
  
  

  export interface IBeanScopeLocale {
    'admin-rbac': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
