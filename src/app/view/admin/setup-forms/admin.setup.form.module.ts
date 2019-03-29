import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

// components
// import { AdminHomeComponent } from '../home/admin.home.component';
import { RegionComponent, AddRegionField, DeleteRegionField, EditRegionField } from './region/region.component';
import { BranchComponent, AddBranchField, DeleteBranchField, EditBranchField } from './branch/branch.component';
import { RoleComponent, AddRoleField, DeleteRoleField, EditRoleField } from './role/role.component';
import { PermissionComponent, AddPermissionField, DeletePermissionField, EditPermissionField } from './permission/permission.component';
import { AssignPermissionComponent, ViewRolePermission } from './assign.permission/assign.permission.component';

import { ManageBranchComponent } from './manage.branch/manage.branch.component';
import { ManageRoleComponent } from './manage.role/manage.role.component';


import { MaterialModule } from "../../../material/material.module";
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
    declarations: [
        RegionComponent, AddRegionField,
        DeleteRegionField, EditRegionField,
        BranchComponent, AddBranchField,
        DeleteBranchField, EditBranchField,
        RoleComponent, AddRoleField,
        DeleteRoleField, EditRoleField,
        PermissionComponent, AddPermissionField,
        DeletePermissionField, EditPermissionField,
        AssignPermissionComponent, ViewRolePermission,
        ManageBranchComponent,
        ManageRoleComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild([
            // {
            //     path: 'region',
            //     component: RegionComponent
            // },
            // {
            //     path: 'branch',
            //     component: BranchComponent
            // },
            // {
            //     path: 'designation',
            //     component: DesignationComponent
            // },
            // {
            //     path: 'role',
            //     component: RoleComponent
            // },
            // {
            //     path: 'permission',
            //     component: PermissionComponent
            // },

            // {
            //     path: 'case-type',
            //     component: CaseTypeComponent
            // },
            // {
            //     path: 'case-nature',
            //     component: CaseNatureComponent
            // },
            // {
            //     path: 'case-territory',
            //     component: CaseTerritoryComponent
            // },
            // {
            //     path: 'case-classification',
            //     component: CaseClassificationComponent
            // },

            {
                path: 'assign-permission',
                component: AssignPermissionComponent
            },
            {
                path: 'manage-branch',
                component: ManageBranchComponent
            },
            {
                path: 'manage-role',
                component: ManageRoleComponent
            },
            { path: '**', redirectTo: '/', pathMatch: 'full' }
        ])
    ],
    entryComponents: [
        AddRegionField,
        DeleteRegionField, EditRegionField,
        AddBranchField,
        DeleteBranchField, EditBranchField,
        AddRoleField,
        DeleteRoleField, EditRoleField,
        AddPermissionField,
        DeletePermissionField, EditPermissionField,
        ViewRolePermission,
    ],
    providers: [
        // ProductService,
        // ProductDetailGuard
    ]
})

export class AdminSetupFormModule { }