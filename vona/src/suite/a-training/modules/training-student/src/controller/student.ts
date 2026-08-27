import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';
import type { IRbacScopeAccess, IRbacScopeOwnerValues } from 'vona-module-a-rbac';
import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Core } from 'vona-module-a-core';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';
import { z } from 'zod';

import type { ModelStudent } from '../model/student.ts';

import { $locale } from '../.metadata/locales.ts';
import { DtoStudentBulkDelete } from '../dto/studentBulkDelete.ts';
import { DtoStudentCreate } from '../dto/studentCreate.tsx';
import { DtoStudentSelectReq } from '../dto/studentSelectReq.tsx';
import { DtoStudentSelectRes } from '../dto/studentSelectRes.tsx';
import { DtoStudentSummary } from '../dto/studentSummary.tsx';
import { DtoStudentUpdate } from '../dto/studentUpdate.tsx';
import { DtoStudentView } from '../dto/studentView.tsx';

export interface IControllerOptionsStudent extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsStudent>('student', {
  summary: $locale('StudentController'),
})
@Resource()
export class ControllerStudent extends BeanBase {
  @Web.post({ summary: $locale('StudentCreate') })
  @Api.body(v.tableIdentity())
  @Passport.rbac({ dataScope: true })
  async create(
    @Arg.body() student: DtoStudentCreate,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<TableIdentity> {
    return (
      await this.scope.service.student.create(
        this._prepareStudentCreateData(student, rbacScopeCurrent),
      )
    ).id;
  }

  @Web.get({ summary: $locale('StudentSelect') })
  @Api.body(DtoStudentSelectRes)
  @Core.serializer()
  @Passport.rbac({ dataScope: true })
  async select(
    @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select({
      ...params,
      where: rbacScopeCurrent.where(params?.where),
    });
  }

  @Web.get(':id', { summary: $locale('StudentView') })
  @Api.body(v.optional(), v.object(DtoStudentView))
  @Core.serializer()
  @Passport.rbac({ dataScope: true })
  async view(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<DtoStudentView | undefined> {
    const data = await this.scope.service.student.view(id);
    rbacScopeCurrent.checkEntry(data);
    return data;
  }

  @Web.patch(':id', { summary: $locale('StudentUpdate') })
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true })
  async update(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.body() student: DtoStudentUpdate,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const data = await this.scope.model.student.getById(id);
    if (!data) this.app.throw(404, 'Student not found');
    rbacScopeCurrent.checkEntry(data);
    await this.scope.service.student.update(id, {
      ...student,
      trainingRecords: this._prepareTrainingRecords(student.trainingRecords, {
        departmentId: data.departmentId,
        userIdOwner: data.userIdOwner,
      }),
    });
  }

  @Web.get('summary/:id', { summary: $locale('StudentSummary') })
  @Api.body(v.optional(), v.object(DtoStudentSummary))
  @Core.serializer()
  @Passport.rbac({ dataScope: true, actionInherit: 'view' })
  async summary(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<DtoStudentSummary | undefined> {
    const data = await this.scope.model.student.getById(id);
    rbacScopeCurrent.checkEntry(data);
    return await this.scope.service.student.summary(id);
  }

  @Web.delete(':id', { summary: $locale('StudentDelete') })
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true })
  async delete(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const data = await this.scope.model.student.getById(id);
    rbacScopeCurrent.checkEntry(data);
    await this.scope.service.student.delete(id);
  }

  @Web.delete('deleteForce/:id', { summary: $locale('StudentDeleteForce') })
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true, actionInherit: 'delete' })
  async deleteForce(
    @Arg.param('id', v.tableIdentity()) id: TableIdentity,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const data = await this.scope.model.student.getById(id, { disableDeleted: true });
    rbacScopeCurrent.checkEntry(data);
    await this.scope.service.student.deleteForce(id);
  }

  @Web.delete('bulk', { summary: $locale('StudentDeleteBulk') })
  @Api.body(z.null())
  @Passport.rbac({ dataScope: true, actionInherit: 'delete' })
  async deleteBulk(
    @Arg.body() command: DtoStudentBulkDelete,
    @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
  ): Promise<void> {
    const uniqueIds = new Set(command.ids.map(id => String(id)));
    if (!uniqueIds.size) this.app.throw(422, 'Student identities are required');
    if (uniqueIds.size !== command.ids.length) {
      this.app.throw(422, 'Duplicate student identity');
    }

    const datas = await this.scope.model.student.select({ where: { id: command.ids } });
    if (datas.length !== uniqueIds.size) this.app.throw(404, 'Student not found');
    rbacScopeCurrent.checkEntries(datas);
    await this.scope.service.student.deleteBulk(command.ids);
  }

  private _prepareStudentCreateData(student: DtoStudentCreate, rbacScopeCurrent: IRbacScopeAccess) {
    const ownerValues = rbacScopeCurrent.ownerValues();
    return {
      ...student,
      ...ownerValues,
      trainingRecords: this._prepareTrainingRecords(student.trainingRecords, ownerValues),
    };
  }

  private _prepareTrainingRecords<T extends object>(
    trainingRecords: T[] | undefined,
    ownerValues: IRbacScopeOwnerValues | undefined,
  ): T[] | undefined {
    if (!trainingRecords) return undefined;
    if (!ownerValues) this.app.throw(500, 'Student scope owner values are unavailable');
    return trainingRecords.map(item => ({
      ...item,
      ...ownerValues,
    }));
  }
}
