import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IRbacScopeAccess } from 'vona-module-a-rbac';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelRecord } from '../model/record.ts';

import { DtoRecordBulkDelete } from '../dto/recordBulkDelete.ts';
import { DtoRecordCreate } from '../dto/recordCreate.tsx';
import { DtoRecordSelectReq } from '../dto/recordSelectReq.tsx';
import { DtoRecordSelectRes } from '../dto/recordSelectRes.tsx';
import { DtoRecordUpdate } from '../dto/recordUpdate.tsx';
import { DtoRecordView } from '../dto/recordView.tsx';

export interface IControllerOptionsRecord extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsRecord>('record')
@Resource()
export class ControllerRecord extends BeanBase {
  @Web.post()
  @Api.body(v.tableIdentity())
  @Passport.rbac({ dataScope: true })
  async create(
    @Arg.body() record: DtoRecordCreate,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<TableIdentity> {
    const student = await this.app
      .scope('training-student')
      .model.student.getById(record.studentId);
    rbacScopeCurrent.checkEntry(student);
    if (!student) this.app.throw(404, 'Student not found');
    return (
      await this.scope.service.record.create({
        ...record,
        departmentId: student.departmentId,
        userIdOwner: student.userIdOwner,
      })
    ).id;
  }

  @Web.get()
  @Api.body(DtoRecordSelectRes)
  @Core.serializer()
  @Passport.rbac({ dataScope: true })
  async select(
    @Arg.filter(DtoRecordSelectReq) params: IQueryParams<ModelRecord>,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<DtoRecordSelectRes> {
    return await this.scope.service.record.select({
      ...params,
      where: rbacScopeCurrent.where(params?.where),
    });
  }

  @Web.get(':id')
  @Api.body(v.optional(), v.object(DtoRecordView))
  @Core.serializer()
  @Passport.rbac({ dataScope: true })
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<DtoRecordView | undefined> {
    const data = await this.scope.service.record.view(id);
    rbacScopeCurrent.checkEntry(data);
    return data;
  }

  @Web.patch(':id')
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true })
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() record: DtoRecordUpdate,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const data = await this.scope.service.record.view(id);
    rbacScopeCurrent.checkEntry(data);
    await this.scope.service.record.update(id, record);
  }

  @Web.delete(':id')
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true })
  async delete(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const data = await this.scope.service.record.view(id);
    rbacScopeCurrent.checkEntry(data);
    await this.scope.service.record.delete(id);
  }

  @Web.delete('bulk')
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true, actionInherit: 'delete' })
  async deleteBulk(
    @Arg.body() command: DtoRecordBulkDelete,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const uniqueIds = new Set(command.ids.map(id => String(id)));
    if (!uniqueIds.size) this.app.throw(422, 'Record identities are required');
    if (uniqueIds.size !== command.ids.length) {
      this.app.throw(422, 'Duplicate record identity');
    }

    const datas = await this.scope.model.record.mget(command.ids);
    if (datas.length !== uniqueIds.size) this.app.throw(404, 'Record not found');
    rbacScopeCurrent.checkEntries(datas);
    await this.scope.service.record.deleteBulk(command.ids);
  }
}
