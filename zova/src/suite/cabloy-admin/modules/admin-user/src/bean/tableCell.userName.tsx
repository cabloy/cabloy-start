import type { TableIdentity } from 'table-identity';
import type { IResourceTableActionRowOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { VAvatar, VBtn } from 'vuetify/components';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'admin-user:userName'?: ITableCellOptionsUserName;
  }
}

export interface ITableCellOptionsUserName extends IResourceTableActionRowOptionsBase {
  color?: string;
  relationName?: string;
  variant?: 'elevated' | 'flat' | 'outlined' | 'plain' | 'text' | 'tonal';
}

interface IUserRelation {
  id: TableIdentity;
  name: unknown;
  avatar?: unknown;
}

@TableCell<ITableCellOptionsUserName>({
  class: 'pa-0',
  color: '',
  variant: 'text',
})
export class TableCellUserName extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsUserName,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host, cellContext } = renderContext;
    const relation = this._getRelation(options, renderContext);
    const name = relation?.name ?? next();
    const avatar = relation?.avatar ?? cellContext.row.original.avatar;
    const commandOptions = relation ? { ...options, id: relation.id } : options;
    return (
      <VBtn
        class={options.class}
        color={options.color}
        variant={options.variant}
        v-slots={{
          prepend: () => (
            <VAvatar image={avatar || this.$scopeBase.config.avatar.empty} size={24} />
          ),
        }}
        nativeOnClick={async event => {
          event.preventDefault();
          event.stopPropagation();
          await $host.$performCommand('start-commands:view', commandOptions, renderContext);
        }}
      >
        {name}
      </VBtn>
    );
  }

  private _getRelation(
    options: ITableCellOptionsUserName,
    renderContext: IJsxRenderContextTableCell,
  ): IUserRelation | undefined {
    const relationName = options.relationName ?? this._getRelationName(renderContext);
    const relation = relationName
      ? renderContext.cellContext.row.original[relationName]
      : undefined;
    return this._isUserRelation(relation) ? relation : undefined;
  }

  private _getRelationName(renderContext: IJsxRenderContextTableCell): string | undefined {
    const name = renderContext.$celScope.name;
    return name.endsWith('Id') ? name.slice(0, -2) : undefined;
  }

  private _isUserRelation(value: unknown): value is IUserRelation {
    return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
  }
}
