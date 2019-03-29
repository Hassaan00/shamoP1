import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
// import { AdminHomeComponent } from '../home/admin.home.component';
import { UserListComponent } from './list/user.list.component';
import { UserAddComponent } from './add/user.add.component';
import { UserEditComponent } from './edit/user.edit.component';
import { UserViewComponent } from './view/user.view.component';

// pipe
import { UserFilterPipe } from '../../../pipes/user-filter.pipe';

import { MaterialModule } from "../../../material/material.module";
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from "@angular/common";



@NgModule({
    declarations: [
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
            {
                path: 'users/list',
                component: UserListComponent
            },
            {
                path: 'users/add',
                component: UserAddComponent
            },
            {
                path: 'users/edit/:id',
                component: UserEditComponent
            },
            {
                path: 'users/view/:id',
                component: UserViewComponent
            },
            { path: '**', redirectTo: '/', pathMatch: 'full' }
        ])
    ],
    entryComponents: [],
    providers: [
        // ProductService,
        // ProductDetailGuard
    ]
})

export class AdminUserModule { }