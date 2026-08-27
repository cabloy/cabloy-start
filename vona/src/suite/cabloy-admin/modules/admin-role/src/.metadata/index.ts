// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/systemAdminAudit.tsx';
export * from '../entity/systemAdminFreshProof.tsx';
export * from '../entity/systemAdminSessionEviction.tsx';
import type { IEntityOptionsSystemAdminAudit } from '../entity/systemAdminAudit.tsx';
import type { IEntityOptionsSystemAdminFreshProof } from '../entity/systemAdminFreshProof.tsx';
import type { IEntityOptionsSystemAdminSessionEviction } from '../entity/systemAdminSessionEviction.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'admin-role:systemAdminAudit': IEntityOptionsSystemAdminAudit;
'admin-role:systemAdminFreshProof': IEntityOptionsSystemAdminFreshProof;
'admin-role:systemAdminSessionEviction': IEntityOptionsSystemAdminSessionEviction;
    }


}
declare module 'vona-module-admin-role' {

}
/** entity: end */
/** entity: begin */
import type { EntitySystemAdminAudit } from '../entity/systemAdminAudit.tsx';
import type { EntitySystemAdminFreshProof } from '../entity/systemAdminFreshProof.tsx';
import type { EntitySystemAdminSessionEviction } from '../entity/systemAdminSessionEviction.tsx';
export interface IModuleEntity {
  'systemAdminAudit': EntitySystemAdminAuditMeta;
'systemAdminFreshProof': EntitySystemAdminFreshProofMeta;
'systemAdminSessionEviction': EntitySystemAdminSessionEvictionMeta;
}
/** entity: end */
/** entity: begin */
export type EntitySystemAdminAuditTableName = 'adminRoleSystemAdminAudit';
export type EntitySystemAdminFreshProofTableName = 'adminRoleSystemAdminFreshProof';
export type EntitySystemAdminSessionEvictionTableName = 'adminRoleSystemAdminSessionEviction';
export type EntitySystemAdminAuditMeta=TypeEntityMeta<EntitySystemAdminAudit,EntitySystemAdminAuditTableName>;
export type EntitySystemAdminFreshProofMeta=TypeEntityMeta<EntitySystemAdminFreshProof,EntitySystemAdminFreshProofTableName>;
export type EntitySystemAdminSessionEvictionMeta=TypeEntityMeta<EntitySystemAdminSessionEviction,EntitySystemAdminSessionEvictionTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'adminRoleSystemAdminAudit': EntitySystemAdminAuditMeta;
'adminRoleSystemAdminFreshProof': EntitySystemAdminFreshProofMeta;
'adminRoleSystemAdminSessionEviction': EntitySystemAdminSessionEvictionMeta;
  }
}
declare module 'vona-module-admin-role' {

    export interface IEntityOptionsSystemAdminAudit {
      fields?: TypeEntityOptionsFields<EntitySystemAdminAudit, IEntityOptionsSystemAdminAudit[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsSystemAdminFreshProof {
      fields?: TypeEntityOptionsFields<EntitySystemAdminFreshProof, IEntityOptionsSystemAdminFreshProof[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsSystemAdminSessionEviction {
      fields?: TypeEntityOptionsFields<EntitySystemAdminSessionEviction, IEntityOptionsSystemAdminSessionEviction[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/systemAdminAudit.ts';
export * from '../model/systemAdminFreshProof.ts';
export * from '../model/systemAdminSessionEviction.ts';
import type { IModelOptionsSystemAdminAudit } from '../model/systemAdminAudit.ts';
import type { IModelOptionsSystemAdminFreshProof } from '../model/systemAdminFreshProof.ts';
import type { IModelOptionsSystemAdminSessionEviction } from '../model/systemAdminSessionEviction.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'admin-role:systemAdminAudit': IModelOptionsSystemAdminAudit;
'admin-role:systemAdminFreshProof': IModelOptionsSystemAdminFreshProof;
'admin-role:systemAdminSessionEviction': IModelOptionsSystemAdminSessionEviction;
    }


}
declare module 'vona-module-admin-role' {

        export interface ModelSystemAdminAudit {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ModelSystemAdminAudit {
            get $beanFullName(): 'admin-role.model.systemAdminAudit';
            get $onionName(): 'admin-role:systemAdminAudit';
            get $onionOptions(): IModelOptionsSystemAdminAudit;
          }

        export interface ModelSystemAdminFreshProof {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ModelSystemAdminFreshProof {
            get $beanFullName(): 'admin-role.model.systemAdminFreshProof';
            get $onionName(): 'admin-role:systemAdminFreshProof';
            get $onionOptions(): IModelOptionsSystemAdminFreshProof;
          }

        export interface ModelSystemAdminSessionEviction {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ModelSystemAdminSessionEviction {
            get $beanFullName(): 'admin-role.model.systemAdminSessionEviction';
            get $onionName(): 'admin-role:systemAdminSessionEviction';
            get $onionOptions(): IModelOptionsSystemAdminSessionEviction;
          }
}
/** model: end */
/** model: begin */
import type { ModelSystemAdminAudit } from '../model/systemAdminAudit.ts';
import type { ModelSystemAdminFreshProof } from '../model/systemAdminFreshProof.ts';
import type { ModelSystemAdminSessionEviction } from '../model/systemAdminSessionEviction.ts';
export interface IModuleModel {
  'systemAdminAudit': ModelSystemAdminAudit;
'systemAdminFreshProof': ModelSystemAdminFreshProof;
'systemAdminSessionEviction': ModelSystemAdminSessionEviction;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-role.model.systemAdminAudit': ModelSystemAdminAudit;
'admin-role.model.systemAdminFreshProof': ModelSystemAdminFreshProof;
'admin-role.model.systemAdminSessionEviction': ModelSystemAdminSessionEviction;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-admin-role' {

  export interface ModelSystemAdminAudit {
      [SymbolKeyEntity]: EntitySystemAdminAudit;
      [SymbolKeyEntityMeta]: EntitySystemAdminAuditMeta;
      [SymbolKeyModelOptions]: IModelOptionsSystemAdminAudit;
      get<T extends IModelGetOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(where: TypeModelWhere<EntitySystemAdminAudit>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(where: TypeModelWhere<EntitySystemAdminAudit>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T> | undefined>;
      mget<T extends IModelGetOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntitySystemAdminAudit, ModelSystemAdminAudit, T>>;
      select<T extends IModelSelectParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T>[]>;
      insert<T extends IModelInsertOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(data?: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(items: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T, true>[]>;
      update<T extends IModelUpdateOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(data: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>>;
      updateBulk<T extends IModelUpdateOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(items: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>[]>;
      delete<T extends IModelDeleteOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(where?: TypeModelWhere<EntitySystemAdminAudit>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(data?: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>>;
      mutateBulk<T extends IModelMutateOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(items: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>[]>;
      count<T extends IModelSelectCountParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntitySystemAdminAudit,ModelSystemAdminAudit,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntitySystemAdminAudit, T>[]>;
      getById<T extends IModelGetOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminAudit, ModelSystemAdminAudit, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(id: TableIdentity, data: TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminAudit,ModelSystemAdminAudit, T>>;
deleteById<T extends IModelDeleteOptions<EntitySystemAdminAudit,ModelSystemAdminAudit>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelSystemAdminFreshProof {
      [SymbolKeyEntity]: EntitySystemAdminFreshProof;
      [SymbolKeyEntityMeta]: EntitySystemAdminFreshProofMeta;
      [SymbolKeyModelOptions]: IModelOptionsSystemAdminFreshProof;
      get<T extends IModelGetOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(where: TypeModelWhere<EntitySystemAdminFreshProof>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(where: TypeModelWhere<EntitySystemAdminFreshProof>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T> | undefined>;
      mget<T extends IModelGetOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T>>;
      select<T extends IModelSelectParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T>[]>;
      insert<T extends IModelInsertOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(data?: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(items: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T, true>[]>;
      update<T extends IModelUpdateOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(data: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>>;
      updateBulk<T extends IModelUpdateOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(items: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>[]>;
      delete<T extends IModelDeleteOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(where?: TypeModelWhere<EntitySystemAdminFreshProof>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(data?: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>>;
      mutateBulk<T extends IModelMutateOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(items: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>[]>;
      count<T extends IModelSelectCountParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntitySystemAdminFreshProof, T>[]>;
      getById<T extends IModelGetOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminFreshProof, ModelSystemAdminFreshProof, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(id: TableIdentity, data: TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof, T>>;
deleteById<T extends IModelDeleteOptions<EntitySystemAdminFreshProof,ModelSystemAdminFreshProof>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelSystemAdminSessionEviction {
      [SymbolKeyEntity]: EntitySystemAdminSessionEviction;
      [SymbolKeyEntityMeta]: EntitySystemAdminSessionEvictionMeta;
      [SymbolKeyModelOptions]: IModelOptionsSystemAdminSessionEviction;
      get<T extends IModelGetOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(where: TypeModelWhere<EntitySystemAdminSessionEviction>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(where: TypeModelWhere<EntitySystemAdminSessionEviction>, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T> | undefined>;
      mget<T extends IModelGetOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T>>;
      select<T extends IModelSelectParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T>[]>;
      insert<T extends IModelInsertOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(data?: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(items: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T, true>[]>;
      update<T extends IModelUpdateOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(data: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>>;
      updateBulk<T extends IModelUpdateOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(items: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>[]>;
      delete<T extends IModelDeleteOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(where?: TypeModelWhere<EntitySystemAdminSessionEviction>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(data?: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>>;
      mutateBulk<T extends IModelMutateOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(items: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>[], options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>[]>;
      count<T extends IModelSelectCountParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntitySystemAdminSessionEviction, T>[]>;
      getById<T extends IModelGetOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntitySystemAdminSessionEviction, ModelSystemAdminSessionEviction, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(id: TableIdentity, data: TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>, options?: T): Promise<TypeModelMutateRelationData<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction, T>>;
deleteById<T extends IModelDeleteOptions<EntitySystemAdminSessionEviction,ModelSystemAdminSessionEviction>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'admin-role:systemAdminAudit': ModelSystemAdminAudit;
'admin-role:systemAdminFreshProof': ModelSystemAdminFreshProof;
'admin-role:systemAdminSessionEviction': ModelSystemAdminSessionEviction;
  }
}
/** model: end */
/** service: begin */
export * from '../service/role.ts';
export * from '../service/systemAdmin.ts';
export * from '../service/systemAdminSessionEviction.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'admin-role:role': never;
'admin-role:systemAdmin': never;
'admin-role:systemAdminSessionEviction': never;
    }


}
declare module 'vona-module-admin-role' {

        export interface ServiceRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ServiceRole {
            get $beanFullName(): 'admin-role.service.role';
            get $onionName(): 'admin-role:role';
          }

        export interface ServiceSystemAdmin {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ServiceSystemAdmin {
            get $beanFullName(): 'admin-role.service.systemAdmin';
            get $onionName(): 'admin-role:systemAdmin';
          }

        export interface ServiceSystemAdminSessionEviction {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ServiceSystemAdminSessionEviction {
            get $beanFullName(): 'admin-role.service.systemAdminSessionEviction';
            get $onionName(): 'admin-role:systemAdminSessionEviction';
          }
}
/** service: end */
/** service: begin */
import type { ServiceRole } from '../service/role.ts';
import type { ServiceSystemAdmin } from '../service/systemAdmin.ts';
import type { ServiceSystemAdminSessionEviction } from '../service/systemAdminSessionEviction.ts';
export interface IModuleService {
  'role': ServiceRole;
'systemAdmin': ServiceSystemAdmin;
'systemAdminSessionEviction': ServiceSystemAdminSessionEviction;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-role.service.role': ServiceRole;
'admin-role.service.systemAdmin': ServiceSystemAdmin;
'admin-role.service.systemAdminSessionEviction': ServiceSystemAdminSessionEviction;
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
      'admin-role:index': IMetaOptionsIndex;
'admin-role:redlock': never;
'admin-role:version': never;
    }


}
declare module 'vona-module-admin-role' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface MetaIndex {
            get $beanFullName(): 'admin-role.meta.index';
            get $onionName(): 'admin-role:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaRedlock {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface MetaRedlock {
            get $beanFullName(): 'admin-role.meta.redlock';
            get $onionName(): 'admin-role:redlock';
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface MetaVersion {
            get $beanFullName(): 'admin-role.meta.version';
            get $onionName(): 'admin-role:version';
          }
}
/** meta: end */
/** meta redlock: begin */
import type { MetaRedlock } from '../bean/meta.redlock.ts';
/** meta redlock: end */
/** queue: begin */
export * from '../bean/queue.systemAdminSessionEviction.ts';

import { type IDecoratorQueueOptions } from 'vona-module-a-queue';
declare module 'vona-module-a-queue' {

    export interface IQueueRecord {
      'admin-role:systemAdminSessionEviction': IDecoratorQueueOptions;
    }


}
declare module 'vona-module-admin-role' {

        export interface QueueSystemAdminSessionEviction {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface QueueSystemAdminSessionEviction {
            get $beanFullName(): 'admin-role.queue.systemAdminSessionEviction';
            get $onionName(): 'admin-role:systemAdminSessionEviction';
            get $onionOptions(): IDecoratorQueueOptions;
          }
}
/** queue: end */
/** queue: begin */
import type { QueueSystemAdminSessionEviction } from '../bean/queue.systemAdminSessionEviction.ts';
export interface IModuleQueue {
  'systemAdminSessionEviction': QueueSystemAdminSessionEviction;
}
/** queue: end */
/** schedule: begin */
export * from '../bean/schedule.systemAdminSessionEviction.ts';

import { type IDecoratorScheduleOptions } from 'vona-module-a-schedule';
declare module 'vona-module-a-schedule' {

    export interface IScheduleRecord {
      'admin-role:systemAdminSessionEviction': IDecoratorScheduleOptions;
    }


}
declare module 'vona-module-admin-role' {

        export interface ScheduleSystemAdminSessionEviction {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ScheduleSystemAdminSessionEviction {
            get $beanFullName(): 'admin-role.schedule.systemAdminSessionEviction';
            get $onionName(): 'admin-role:systemAdminSessionEviction';
            get $onionOptions(): IDecoratorScheduleOptions;
          }
}
/** schedule: end */
/** dto: begin */
export * from '../dto/roleBase.tsx';
export * from '../dto/roleCreate.tsx';
export * from '../dto/roleSelectReq.tsx';
export * from '../dto/roleSelectRes.tsx';
export * from '../dto/roleSelectResItem.tsx';
export * from '../dto/roleUpdate.tsx';
export * from '../dto/roleView.tsx';
export * from '../dto/systemAdminAccountStatus.ts';
export * from '../dto/systemAdminActivation.ts';
export * from '../dto/systemAdminFreshProofIssue.ts';
export * from '../dto/systemAdminFreshProofIssueRes.ts';
export * from '../dto/systemAdminGrant.ts';
export * from '../dto/systemAdminRevoke.ts';
export * from '../dto/userRoleReplace.ts';
import type { IDtoOptionsRoleBase } from '../dto/roleBase.tsx';
import type { IDtoOptionsRoleCreate } from '../dto/roleCreate.tsx';
import type { IDtoOptionsRoleSelectReq } from '../dto/roleSelectReq.tsx';
import type { IDtoOptionsRoleSelectRes } from '../dto/roleSelectRes.tsx';
import type { IDtoOptionsRoleSelectResItem } from '../dto/roleSelectResItem.tsx';
import type { IDtoOptionsRoleUpdate } from '../dto/roleUpdate.tsx';
import type { IDtoOptionsRoleView } from '../dto/roleView.tsx';
import type { IDtoOptionsSystemAdminAccountStatus } from '../dto/systemAdminAccountStatus.ts';
import type { IDtoOptionsSystemAdminActivation } from '../dto/systemAdminActivation.ts';
import type { IDtoOptionsSystemAdminFreshProofIssue } from '../dto/systemAdminFreshProofIssue.ts';
import type { IDtoOptionsSystemAdminFreshProofIssueRes } from '../dto/systemAdminFreshProofIssueRes.ts';
import type { IDtoOptionsSystemAdminGrant } from '../dto/systemAdminGrant.ts';
import type { IDtoOptionsSystemAdminRevoke } from '../dto/systemAdminRevoke.ts';
import type { IDtoOptionsUserRoleReplace } from '../dto/userRoleReplace.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'admin-role:roleBase': IDtoOptionsRoleBase;
'admin-role:roleCreate': IDtoOptionsRoleCreate;
'admin-role:roleSelectReq': IDtoOptionsRoleSelectReq;
'admin-role:roleSelectRes': IDtoOptionsRoleSelectRes;
'admin-role:roleSelectResItem': IDtoOptionsRoleSelectResItem;
'admin-role:roleUpdate': IDtoOptionsRoleUpdate;
'admin-role:roleView': IDtoOptionsRoleView;
'admin-role:systemAdminAccountStatus': IDtoOptionsSystemAdminAccountStatus;
'admin-role:systemAdminActivation': IDtoOptionsSystemAdminActivation;
'admin-role:systemAdminFreshProofIssue': IDtoOptionsSystemAdminFreshProofIssue;
'admin-role:systemAdminFreshProofIssueRes': IDtoOptionsSystemAdminFreshProofIssueRes;
'admin-role:systemAdminGrant': IDtoOptionsSystemAdminGrant;
'admin-role:systemAdminRevoke': IDtoOptionsSystemAdminRevoke;
'admin-role:userRoleReplace': IDtoOptionsUserRoleReplace;
    }


}
declare module 'vona-module-admin-role' {

}
/** dto: end */
/** dto: begin */
import type { DtoRoleBase } from '../dto/roleBase.tsx';
import type { DtoRoleCreate } from '../dto/roleCreate.tsx';
import type { DtoRoleSelectReq } from '../dto/roleSelectReq.tsx';
import type { DtoRoleSelectRes } from '../dto/roleSelectRes.tsx';
import type { DtoRoleSelectResItem } from '../dto/roleSelectResItem.tsx';
import type { DtoRoleUpdate } from '../dto/roleUpdate.tsx';
import type { DtoRoleView } from '../dto/roleView.tsx';
import type { DtoSystemAdminAccountStatus } from '../dto/systemAdminAccountStatus.ts';
import type { DtoSystemAdminActivation } from '../dto/systemAdminActivation.ts';
import type { DtoSystemAdminFreshProofIssue } from '../dto/systemAdminFreshProofIssue.ts';
import type { DtoSystemAdminFreshProofIssueRes } from '../dto/systemAdminFreshProofIssueRes.ts';
import type { DtoSystemAdminGrant } from '../dto/systemAdminGrant.ts';
import type { DtoSystemAdminRevoke } from '../dto/systemAdminRevoke.ts';
import type { DtoUserRoleReplace } from '../dto/userRoleReplace.ts';
declare module 'vona-module-admin-role' {

    export interface IDtoOptionsRoleBase {
      fields?: TypeEntityOptionsFields<DtoRoleBase, IDtoOptionsRoleBase[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleCreate {
      fields?: TypeEntityOptionsFields<DtoRoleCreate, IDtoOptionsRoleCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectReq {
      fields?: TypeEntityOptionsFields<DtoRoleSelectReq, IDtoOptionsRoleSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectRes {
      fields?: TypeEntityOptionsFields<DtoRoleSelectRes, IDtoOptionsRoleSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleSelectResItem {
      fields?: TypeEntityOptionsFields<DtoRoleSelectResItem, IDtoOptionsRoleSelectResItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleUpdate {
      fields?: TypeEntityOptionsFields<DtoRoleUpdate, IDtoOptionsRoleUpdate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleView {
      fields?: TypeEntityOptionsFields<DtoRoleView, IDtoOptionsRoleView[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminAccountStatus {
      fields?: TypeEntityOptionsFields<DtoSystemAdminAccountStatus, IDtoOptionsSystemAdminAccountStatus[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminActivation {
      fields?: TypeEntityOptionsFields<DtoSystemAdminActivation, IDtoOptionsSystemAdminActivation[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminFreshProofIssue {
      fields?: TypeEntityOptionsFields<DtoSystemAdminFreshProofIssue, IDtoOptionsSystemAdminFreshProofIssue[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminFreshProofIssueRes {
      fields?: TypeEntityOptionsFields<DtoSystemAdminFreshProofIssueRes, IDtoOptionsSystemAdminFreshProofIssueRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminGrant {
      fields?: TypeEntityOptionsFields<DtoSystemAdminGrant, IDtoOptionsSystemAdminGrant[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSystemAdminRevoke {
      fields?: TypeEntityOptionsFields<DtoSystemAdminRevoke, IDtoOptionsSystemAdminRevoke[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsUserRoleReplace {
      fields?: TypeEntityOptionsFields<DtoUserRoleReplace, IDtoOptionsUserRoleReplace[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/role.ts';
import type { IControllerOptionsRole } from '../controller/role.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'admin-role:role': IControllerOptionsRole;
    }


}
declare module 'vona-module-admin-role' {

        export interface ControllerRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ControllerRole {
            get $beanFullName(): 'admin-role.controller.role';
            get $onionName(): 'admin-role:role';
            get $onionOptions(): IControllerOptionsRole;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRole } from '../controller/role.ts';
declare module 'vona-module-admin-role' {

    export interface IControllerOptionsRole {
      actions?: TypeControllerOptionsActions<ControllerRole>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/admin/role': undefined;
'/admin/role/system-admin/fresh-proof': undefined;
'/admin/role/system-admin/grant/:userId': undefined;
'/admin/role/system-admin/revoke/:userId': undefined;
    }
export interface IApiPathGetRecord{
        '/admin/role': undefined;
'/admin/role/membership-select': undefined;
'/admin/role/:id': undefined;
    }
export interface IApiPathPatchRecord{
        '/admin/role/:id': undefined;
    }
export interface IApiPathDeleteRecord{
        '/admin/role/:id': undefined;
    }
export interface IApiPathPutRecord{
        '/admin/role/user/:userId/roles': undefined;
'/admin/role/system-admin/account-status/:userId': undefined;
'/admin/role/system-admin/activation/:userId': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'admin-role:role': never;
    }
  }

/** controller: end */
/** zodRefine: begin */
export * from '../bean/zodRefine.siteIdsAvailable.ts';
import type { IZodRefineOptionsSiteIdsAvailable } from '../bean/zodRefine.siteIdsAvailable.ts';
import 'vona-module-a-zod';
declare module 'vona-module-a-zod' {

    export interface IZodRefineRecord {
      'admin-role:siteIdsAvailable': IZodRefineOptionsSiteIdsAvailable;
    }


}
declare module 'vona-module-admin-role' {

        export interface ZodRefineSiteIdsAvailable {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface ZodRefineSiteIdsAvailable {
            get $beanFullName(): 'admin-role.zodRefine.siteIdsAvailable';
            get $onionName(): 'admin-role:siteIdsAvailable';
            get $onionOptions(): IZodRefineOptionsSiteIdsAvailable;
          }
}
/** zodRefine: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.role.ts';
import type { ISsrMenuOptionsRole } from '../bean/ssrMenu.role.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'admin-role:role': ISsrMenuOptionsRole;
    }


}
declare module 'vona-module-admin-role' {

        export interface SsrMenuRole {
          /** @internal */
          get scope(): ScopeModuleAdminRole;
        }

          export interface SsrMenuRole {
            get $beanFullName(): 'admin-role.ssrMenu.role';
            get $onionName(): 'admin-role:role';
            get $onionOptions(): ISsrMenuOptionsRole;
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
export class ScopeModuleAdminRole extends BeanScopeBase {}

export interface ScopeModuleAdminRole {
  util: BeanScopeUtil;
error: TypeModuleErrors<typeof errors>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
redlock: MetaRedlock;
queue: IModuleQueue;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-role': ScopeModuleAdminRole;
  }

  export interface IBeanScopeContainer {
    adminRole: ScopeModuleAdminRole;
  }



  export interface IBeanScopeLocale {
    'admin-role': (typeof locales)[TypeLocaleBase];
  }

  export interface IBeanScopeErrors {
    'admin-role': typeof errors;
  }
}
/** scope: end */
