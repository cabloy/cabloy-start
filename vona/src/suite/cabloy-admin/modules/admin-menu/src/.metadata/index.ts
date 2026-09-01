// eslint-disable
import type { TypeEntityMeta,TypeModelsClassLikeGeneral,TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
import type { TableIdentity } from 'table-identity';
/** entity: begin */
export * from '../entity/menuVisibilityRevision.tsx';
export * from '../entity/roleMenu.tsx';
import type { IEntityOptionsMenuVisibilityRevision } from '../entity/menuVisibilityRevision.tsx';
import type { IEntityOptionsRoleMenu } from '../entity/roleMenu.tsx';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IEntityRecord {
      'admin-menu:menuVisibilityRevision': IEntityOptionsMenuVisibilityRevision;
'admin-menu:roleMenu': IEntityOptionsRoleMenu;
    }


}
declare module 'vona-module-admin-menu' {

}
/** entity: end */
/** entity: begin */
import type { EntityMenuVisibilityRevision } from '../entity/menuVisibilityRevision.tsx';
import type { EntityRoleMenu } from '../entity/roleMenu.tsx';
export interface IModuleEntity {
  'menuVisibilityRevision': EntityMenuVisibilityRevisionMeta;
'roleMenu': EntityRoleMenuMeta;
}
/** entity: end */
/** entity: begin */
export type EntityMenuVisibilityRevisionTableName = 'adminMenuMenuVisibilityRevision';
export type EntityRoleMenuTableName = 'adminMenuRoleMenu';
export type EntityMenuVisibilityRevisionMeta=TypeEntityMeta<EntityMenuVisibilityRevision,EntityMenuVisibilityRevisionTableName>;
export type EntityRoleMenuMeta=TypeEntityMeta<EntityRoleMenu,EntityRoleMenuTableName>;
declare module 'vona-module-a-orm' {
  export interface ITableRecord {
    'adminMenuMenuVisibilityRevision': EntityMenuVisibilityRevisionMeta;
'adminMenuRoleMenu': EntityRoleMenuMeta;
  }
}
declare module 'vona-module-admin-menu' {

    export interface IEntityOptionsMenuVisibilityRevision {
      fields?: TypeEntityOptionsFields<EntityMenuVisibilityRevision, IEntityOptionsMenuVisibilityRevision[TypeSymbolKeyFieldsMore]>;
    }

    export interface IEntityOptionsRoleMenu {
      fields?: TypeEntityOptionsFields<EntityRoleMenu, IEntityOptionsRoleMenu[TypeSymbolKeyFieldsMore]>;
    }
}
/** entity: end */
/** model: begin */
export * from '../model/menuVisibilityRevision.ts';
export * from '../model/roleMenu.ts';
import type { IModelOptionsMenuVisibilityRevision } from '../model/menuVisibilityRevision.ts';
import type { IModelOptionsRoleMenu } from '../model/roleMenu.ts';
import 'vona-module-a-orm';
declare module 'vona-module-a-orm' {

    export interface IModelRecord {
      'admin-menu:menuVisibilityRevision': IModelOptionsMenuVisibilityRevision;
'admin-menu:roleMenu': IModelOptionsRoleMenu;
    }


}
declare module 'vona-module-admin-menu' {

        export interface ModelMenuVisibilityRevision {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ModelMenuVisibilityRevision {
            get $beanFullName(): 'admin-menu.model.menuVisibilityRevision';
            get $onionName(): 'admin-menu:menuVisibilityRevision';
            get $onionOptions(): IModelOptionsMenuVisibilityRevision;
          }

        export interface ModelRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ModelRoleMenu {
            get $beanFullName(): 'admin-menu.model.roleMenu';
            get $onionName(): 'admin-menu:roleMenu';
            get $onionOptions(): IModelOptionsRoleMenu;
          }
}
/** model: end */
/** model: begin */
import type { ModelMenuVisibilityRevision } from '../model/menuVisibilityRevision.ts';
import type { ModelRoleMenu } from '../model/roleMenu.ts';
export interface IModuleModel {
  'menuVisibilityRevision': ModelMenuVisibilityRevision;
'roleMenu': ModelRoleMenu;
}
/** model: end */
/** model: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-menu.model.menuVisibilityRevision': ModelMenuVisibilityRevision;
'admin-menu.model.roleMenu': ModelRoleMenu;
  }
}
/** model: end */
/** model: begin */
import type { IModelGetOptions, IModelMethodOptions, IModelSelectParams, TypeModelSelectAndCount, TypeModelRelationResult, TypeModelWhere, IModelInsertOptions, TypeModelMutateRelationData, IModelDeleteOptions, IModelUpdateOptions, IModelMutateOptions, IModelSelectCountParams, IModelIncrementParams, IModelSelectAggrParams, TypeModelAggrRelationResult, IModelSelectGroupParams, TypeModelGroupRelationResult } from 'vona-module-a-orm';
import { SymbolKeyEntity, SymbolKeyEntityMeta, SymbolKeyModelOptions } from 'vona-module-a-orm';
declare module 'vona-module-admin-menu' {

  export interface ModelMenuVisibilityRevision {
      [SymbolKeyEntity]: EntityMenuVisibilityRevision;
      [SymbolKeyEntityMeta]: EntityMenuVisibilityRevisionMeta;
      [SymbolKeyModelOptions]: IModelOptionsMenuVisibilityRevision;
      get<T extends IModelGetOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(where: TypeModelWhere<EntityMenuVisibilityRevision>, options?: T): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(where: TypeModelWhere<EntityMenuVisibilityRevision>, options?: T): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T> | undefined>;
      mget<T extends IModelGetOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T>>;
      select<T extends IModelSelectParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T>[]>;
      insert<T extends IModelInsertOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(data?: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(items: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(data: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(items: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>[]>;
      delete<T extends IModelDeleteOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(where?: TypeModelWhere<EntityMenuVisibilityRevision>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(data?: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(items: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>[]>;
      count<T extends IModelSelectCountParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityMenuVisibilityRevision, T>[]>;
      getById<T extends IModelGetOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityMenuVisibilityRevision, ModelMenuVisibilityRevision, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>, options?: T): Promise<TypeModelMutateRelationData<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision, T>>;
deleteById<T extends IModelDeleteOptions<EntityMenuVisibilityRevision,ModelMenuVisibilityRevision>>(id: TableIdentity, options?: T): Promise<void>;
    }
export interface ModelRoleMenu {
      [SymbolKeyEntity]: EntityRoleMenu;
      [SymbolKeyEntityMeta]: EntityRoleMenuMeta;
      [SymbolKeyModelOptions]: IModelOptionsRoleMenu;
      get<T extends IModelGetOptions<EntityRoleMenu,ModelRoleMenu>>(where: TypeModelWhere<EntityRoleMenu>, options?: T): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T> | undefined>;
      /**
       * Retrieves one matching primary row with a pessimistic FOR UPDATE lock.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getForUpdate<T extends IModelGetOptions<EntityRoleMenu,ModelRoleMenu>>(where: TypeModelWhere<EntityRoleMenu>, options?: T): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T> | undefined>;
      /**
       * Retrieves a primary row by ID with the same pessimistic FOR UPDATE lock semantics.
       * Requires an active transaction. The lock is released when that transaction completes.
       * Entity and query caches are bypassed.
       */
      getByIdForUpdate<T extends IModelGetOptions<EntityRoleMenu,ModelRoleMenu>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T> | undefined>;
      mget<T extends IModelGetOptions<EntityRoleMenu,ModelRoleMenu>>(ids: TableIdentity[], options?: T): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T>[]>;
      selectAndCount<T extends IModelSelectParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelSelectAndCount<EntityRoleMenu, ModelRoleMenu, T>>;
      select<T extends IModelSelectParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T>[]>;
      insert<T extends IModelInsertOptions<EntityRoleMenu,ModelRoleMenu>>(data?: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T, true>>;
      insertBulk<T extends IModelInsertOptions<EntityRoleMenu,ModelRoleMenu>>(items: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T, true>[]>;
      update<T extends IModelUpdateOptions<EntityRoleMenu,ModelRoleMenu>>(data: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>>;
      updateBulk<T extends IModelUpdateOptions<EntityRoleMenu,ModelRoleMenu>>(items: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>[]>;
      delete<T extends IModelDeleteOptions<EntityRoleMenu,ModelRoleMenu>>(where?: TypeModelWhere<EntityRoleMenu>, options?: T): Promise<void>;
      deleteBulk<T extends IModelDeleteOptions<EntityRoleMenu,ModelRoleMenu>>(ids: TableIdentity[], options?: T): Promise<void>;
      mutate<T extends IModelMutateOptions<EntityRoleMenu,ModelRoleMenu>>(data?: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>>;
      mutateBulk<T extends IModelMutateOptions<EntityRoleMenu,ModelRoleMenu>>(items: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>[], options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>[]>;
      count<T extends IModelSelectCountParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<string | undefined>;
      increment<T extends IModelIncrementParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      decrement<T extends IModelIncrementParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<number>;
      aggregate<T extends IModelSelectAggrParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelAggrRelationResult<T>>;
      group<T extends IModelSelectGroupParams<EntityRoleMenu,ModelRoleMenu,ModelJoins>, ModelJoins extends TypeModelsClassLikeGeneral | undefined = undefined>(params?: T, options?: IModelMethodOptions, modelJoins?: ModelJoins): Promise<TypeModelGroupRelationResult<EntityRoleMenu, T>[]>;
      getById<T extends IModelGetOptions<EntityRoleMenu,ModelRoleMenu>>(id: TableIdentity, options?: T): Promise<TypeModelRelationResult<EntityRoleMenu, ModelRoleMenu, T> | undefined>;
updateById<T extends IModelUpdateOptions<EntityRoleMenu,ModelRoleMenu>>(id: TableIdentity, data: TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>, options?: T): Promise<TypeModelMutateRelationData<EntityRoleMenu,ModelRoleMenu, T>>;
deleteById<T extends IModelDeleteOptions<EntityRoleMenu,ModelRoleMenu>>(id: TableIdentity, options?: T): Promise<void>;
    }
}
declare module 'vona-module-a-orm' {
  export interface IModelClassRecord {
    'admin-menu:menuVisibilityRevision': ModelMenuVisibilityRevision;
'admin-menu:roleMenu': ModelRoleMenu;
  }
}
/** model: end */
/** service: begin */
export * from '../service/menuVisibilityRevision.ts';
export * from '../service/roleMenu.ts';
export * from '../service/roleMenuProjection.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'admin-menu:menuVisibilityRevision': never;
'admin-menu:roleMenu': never;
'admin-menu:roleMenuProjection': never;
    }


}
declare module 'vona-module-admin-menu' {

        export interface ServiceMenuVisibilityRevision {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ServiceMenuVisibilityRevision {
            get $beanFullName(): 'admin-menu.service.menuVisibilityRevision';
            get $onionName(): 'admin-menu:menuVisibilityRevision';
          }

        export interface ServiceRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ServiceRoleMenu {
            get $beanFullName(): 'admin-menu.service.roleMenu';
            get $onionName(): 'admin-menu:roleMenu';
          }

        export interface ServiceRoleMenuProjection {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ServiceRoleMenuProjection {
            get $beanFullName(): 'admin-menu.service.roleMenuProjection';
            get $onionName(): 'admin-menu:roleMenuProjection';
          }
}
/** service: end */
/** service: begin */
import type { ServiceMenuVisibilityRevision } from '../service/menuVisibilityRevision.ts';
import type { ServiceRoleMenu } from '../service/roleMenu.ts';
import type { ServiceRoleMenuProjection } from '../service/roleMenuProjection.ts';
export interface IModuleService {
  'menuVisibilityRevision': ServiceMenuVisibilityRevision;
'roleMenu': ServiceRoleMenu;
'roleMenuProjection': ServiceRoleMenuProjection;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'admin-menu.service.menuVisibilityRevision': ServiceMenuVisibilityRevision;
'admin-menu.service.roleMenu': ServiceRoleMenu;
'admin-menu.service.roleMenuProjection': ServiceRoleMenuProjection;
  }
}
/** service: end */
/** eventListener: begin */
export * from '../bean/eventListener.menuVisibilityResolver.ts';
export * from '../bean/eventListener.policyInvalidated.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {

    export interface IEventListenerRecord {
      'admin-menu:menuVisibilityResolver': IDecoratorEventListenerOptions;
'admin-menu:policyInvalidated': IDecoratorEventListenerOptions;
    }


}
declare module 'vona-module-admin-menu' {

        export interface EventListenerMenuVisibilityResolver {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface EventListenerMenuVisibilityResolver {
            get $beanFullName(): 'admin-menu.eventListener.menuVisibilityResolver';
            get $onionName(): 'admin-menu:menuVisibilityResolver';
            get $onionOptions(): IDecoratorEventListenerOptions;
          }

        export interface EventListenerPolicyInvalidated {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface EventListenerPolicyInvalidated {
            get $beanFullName(): 'admin-menu.eventListener.policyInvalidated';
            get $onionName(): 'admin-menu:policyInvalidated';
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
      'admin-menu:index': IMetaOptionsIndex;
'admin-menu:version': never;
    }


}
declare module 'vona-module-admin-menu' {

        export interface MetaIndex {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface MetaIndex {
            get $beanFullName(): 'admin-menu.meta.index';
            get $onionName(): 'admin-menu:index';
            get $onionOptions(): IMetaOptionsIndex;
          }

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface MetaVersion {
            get $beanFullName(): 'admin-menu.meta.version';
            get $onionName(): 'admin-menu:version';
          }
}
/** meta: end */
/** dto: begin */
export * from '../dto/roleMenuBatch.ts';
export * from '../dto/roleMenuBatchItem.ts';
export * from '../dto/roleMenuCatalogGroup.ts';
export * from '../dto/roleMenuCatalogMenu.ts';
export * from '../dto/roleMenuCatalogRes.ts';
export * from '../dto/roleMenuCatalogSite.ts';
export * from '../dto/roleMenuCreate.ts';
export * from '../dto/roleMenuDelete.ts';
export * from '../dto/roleMenuRoleConfigurationMenu.ts';
export * from '../dto/roleMenuRoleConfigurationRes.ts';
export * from '../dto/roleMenuRoleConfigurationSite.ts';
import type { IDtoOptionsRoleMenuBatch } from '../dto/roleMenuBatch.ts';
import type { IDtoOptionsRoleMenuBatchItem } from '../dto/roleMenuBatchItem.ts';
import type { IDtoOptionsRoleMenuCatalogGroup } from '../dto/roleMenuCatalogGroup.ts';
import type { IDtoOptionsRoleMenuCatalogMenu } from '../dto/roleMenuCatalogMenu.ts';
import type { IDtoOptionsRoleMenuCatalogRes } from '../dto/roleMenuCatalogRes.ts';
import type { IDtoOptionsRoleMenuCatalogSite } from '../dto/roleMenuCatalogSite.ts';
import type { IDtoOptionsRoleMenuCreate } from '../dto/roleMenuCreate.ts';
import type { IDtoOptionsRoleMenuDelete } from '../dto/roleMenuDelete.ts';
import type { IDtoOptionsRoleMenuRoleConfigurationMenu } from '../dto/roleMenuRoleConfigurationMenu.ts';
import type { IDtoOptionsRoleMenuRoleConfigurationRes } from '../dto/roleMenuRoleConfigurationRes.ts';
import type { IDtoOptionsRoleMenuRoleConfigurationSite } from '../dto/roleMenuRoleConfigurationSite.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'admin-menu:roleMenuBatch': IDtoOptionsRoleMenuBatch;
'admin-menu:roleMenuBatchItem': IDtoOptionsRoleMenuBatchItem;
'admin-menu:roleMenuCatalogGroup': IDtoOptionsRoleMenuCatalogGroup;
'admin-menu:roleMenuCatalogMenu': IDtoOptionsRoleMenuCatalogMenu;
'admin-menu:roleMenuCatalogRes': IDtoOptionsRoleMenuCatalogRes;
'admin-menu:roleMenuCatalogSite': IDtoOptionsRoleMenuCatalogSite;
'admin-menu:roleMenuCreate': IDtoOptionsRoleMenuCreate;
'admin-menu:roleMenuDelete': IDtoOptionsRoleMenuDelete;
'admin-menu:roleMenuRoleConfigurationMenu': IDtoOptionsRoleMenuRoleConfigurationMenu;
'admin-menu:roleMenuRoleConfigurationRes': IDtoOptionsRoleMenuRoleConfigurationRes;
'admin-menu:roleMenuRoleConfigurationSite': IDtoOptionsRoleMenuRoleConfigurationSite;
    }


}
declare module 'vona-module-admin-menu' {

}
/** dto: end */
/** dto: begin */
import type { DtoRoleMenuBatch } from '../dto/roleMenuBatch.ts';
import type { DtoRoleMenuBatchItem } from '../dto/roleMenuBatchItem.ts';
import type { DtoRoleMenuCatalogGroup } from '../dto/roleMenuCatalogGroup.ts';
import type { DtoRoleMenuCatalogMenu } from '../dto/roleMenuCatalogMenu.ts';
import type { DtoRoleMenuCatalogRes } from '../dto/roleMenuCatalogRes.ts';
import type { DtoRoleMenuCatalogSite } from '../dto/roleMenuCatalogSite.ts';
import type { DtoRoleMenuCreate } from '../dto/roleMenuCreate.ts';
import type { DtoRoleMenuDelete } from '../dto/roleMenuDelete.ts';
import type { DtoRoleMenuRoleConfigurationMenu } from '../dto/roleMenuRoleConfigurationMenu.ts';
import type { DtoRoleMenuRoleConfigurationRes } from '../dto/roleMenuRoleConfigurationRes.ts';
import type { DtoRoleMenuRoleConfigurationSite } from '../dto/roleMenuRoleConfigurationSite.ts';
declare module 'vona-module-admin-menu' {

    export interface IDtoOptionsRoleMenuBatch {
      fields?: TypeEntityOptionsFields<DtoRoleMenuBatch, IDtoOptionsRoleMenuBatch[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuBatchItem {
      fields?: TypeEntityOptionsFields<DtoRoleMenuBatchItem, IDtoOptionsRoleMenuBatchItem[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuCatalogGroup {
      fields?: TypeEntityOptionsFields<DtoRoleMenuCatalogGroup, IDtoOptionsRoleMenuCatalogGroup[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuCatalogMenu {
      fields?: TypeEntityOptionsFields<DtoRoleMenuCatalogMenu, IDtoOptionsRoleMenuCatalogMenu[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuCatalogRes {
      fields?: TypeEntityOptionsFields<DtoRoleMenuCatalogRes, IDtoOptionsRoleMenuCatalogRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuCatalogSite {
      fields?: TypeEntityOptionsFields<DtoRoleMenuCatalogSite, IDtoOptionsRoleMenuCatalogSite[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuCreate {
      fields?: TypeEntityOptionsFields<DtoRoleMenuCreate, IDtoOptionsRoleMenuCreate[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuDelete {
      fields?: TypeEntityOptionsFields<DtoRoleMenuDelete, IDtoOptionsRoleMenuDelete[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuRoleConfigurationMenu {
      fields?: TypeEntityOptionsFields<DtoRoleMenuRoleConfigurationMenu, IDtoOptionsRoleMenuRoleConfigurationMenu[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuRoleConfigurationRes {
      fields?: TypeEntityOptionsFields<DtoRoleMenuRoleConfigurationRes, IDtoOptionsRoleMenuRoleConfigurationRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsRoleMenuRoleConfigurationSite {
      fields?: TypeEntityOptionsFields<DtoRoleMenuRoleConfigurationSite, IDtoOptionsRoleMenuRoleConfigurationSite[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/roleMenu.ts';
import type { IControllerOptionsRoleMenu } from '../controller/roleMenu.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'admin-menu:roleMenu': IControllerOptionsRoleMenu;
    }


}
declare module 'vona-module-admin-menu' {

        export interface ControllerRoleMenu {
          /** @internal */
          get scope(): ScopeModuleAdminMenu;
        }

          export interface ControllerRoleMenu {
            get $beanFullName(): 'admin-menu.controller.roleMenu';
            get $onionName(): 'admin-menu:roleMenu';
            get $onionOptions(): IControllerOptionsRoleMenu;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRoleMenu } from '../controller/roleMenu.ts';
declare module 'vona-module-admin-menu' {

    export interface IControllerOptionsRoleMenu {
      actions?: TypeControllerOptionsActions<ControllerRoleMenu>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/admin/menu/roleMenu/catalog': undefined;
'/admin/menu/roleMenu/roles/:roleId/configuration': undefined;
    }
export interface IApiPathPostRecord{
        '/admin/menu/roleMenu': undefined;
    }
export interface IApiPathPutRecord{
        '/admin/menu/roleMenu/batch': undefined;
    }
export interface IApiPathDeleteRecord{
        '/admin/menu/roleMenu': undefined;
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
export class ScopeModuleAdminMenu extends BeanScopeBase {}

export interface ScopeModuleAdminMenu {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
entity: IModuleEntity;
model: IModuleModel;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'admin-menu': ScopeModuleAdminMenu;
  }

  export interface IBeanScopeContainer {
    adminMenu: ScopeModuleAdminMenu;
  }



  export interface IBeanScopeLocale {
    'admin-menu': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
