import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";

import { CanActivateViaAuthGuard } from './../../core/security/auth.guard';


import { MaterialModule } from "../../material/material.module";
import { SharedModule } from '../../shared/shared.module';


import { UserListComponent } from './users/list/user.list.component';
import { UserAddComponent } from './users/add/user.add.component';
import { UserEditComponent } from './users/edit/user.edit.component';
import { UserViewComponent } from './users/view/user.view.component';

// import { LawFirmListComponent } from './lawFirm/lawFirm.list.component';
// import { LawFirmAddComponent } from './lawFirm/lawFirm.add.component';
// pipe
import { UserFilterPipe } from '../../pipes/user-filter.pipe';




@NgModule({
    declarations: [
        // AdminHomeComponent,
        UserListComponent,
        UserAddComponent,
        UserEditComponent,
        UserViewComponent,
        UserFilterPipe
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule,
        RouterModule.forChild([
            // {
            //     path: 'home',
            //     component: AdminHomeComponent
            // },
            {
                path: 'sf',
                loadChildren: './setup-forms/admin.setup.form.module#AdminSetupFormModule',
                canActivate: [CanActivateViaAuthGuard],
            },

            // {
            //     path: 'u',
            //     loadChildren: './setup-forms/admin.setup.form.module#AdminSetupFormModule',
            // },
            {
                path: 'users/list',
                component: UserListComponent,
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'users/add',
                component: UserAddComponent,
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'users/edit/:id',
                component: UserEditComponent,
                canActivate: [CanActivateViaAuthGuard],
            },
            {
                path: 'users/view/:id',
                component: UserViewComponent,
                canActivate: [CanActivateViaAuthGuard],
            },
            { path: '**', redirectTo: '/', pathMatch: 'full' }
        ])
    ],
    entryComponents: [

    ],
    providers: [
        // ProductService,
        // ProductDetailGuard
    ]
})

export class AdminModule { }