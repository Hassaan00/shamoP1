import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from "../../material/material.module";
import { SharedModule } from '../../shared/shared.module';

import { ChangePasswordComponent } from './change.password/change.password.component';

import { CommonModule } from "@angular/common";
import { ProfileComponent } from './profile/profile.component';
import { UploadImageComponent } from './profile/upload-image/upload.image.component';
import { EditProfileComponent } from './profile/edit.profile.component';



@NgModule({
    declarations: [
        ChangePasswordComponent, ProfileComponent, UploadImageComponent, EditProfileComponent
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule, SharedModule,
        RouterModule.forChild([
            {
                path: 'view/profile',
                component: ProfileComponent
            },
            {
                path: 'edit/profile',
                component: EditProfileComponent,
                pathMatch: 'full'
            },
            // {
            //     path: 'edit/profile/:id',
            //     component: EditProfileComponent,
            //     pathMatch: 'full'
            // },
            {
                path: 'change-password',
                component: ChangePasswordComponent
            }
        ])
    ],
    providers: [

    ]
})

export class UserModule { }