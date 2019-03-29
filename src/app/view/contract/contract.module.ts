import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from "../../material/material.module";
import { SharedModule } from '../../shared/shared.module';
import { FileModule } from '../file/file.module';

import { CommonModule } from "@angular/common";
import { ContractComponent } from './form/contract.component';
import { ContractRenewComponent } from './form/contract.renew.component';
import { ContractDetailComponent, ContractHistoryDetail } from './form/contract.detail.component';
import { ContractFileComponent } from './form/contract.uploads/contract.upload.component';
import { ContractListComponent, ContractTerminate } from './list/view.all.contract.component';
import { ContractDashboardComponent } from './dashboard/contract.dashboard.component';


@NgModule({
    declarations: [
        ContractComponent, ContractFileComponent,
        ContractRenewComponent, ContractDetailComponent,
        ContractListComponent, ContractHistoryDetail,
        ContractDashboardComponent,
        ContractTerminate
    ],
    imports: [
        CommonModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule, SharedModule,
        RouterModule.forChild([
            {
                path: 'list',
                component: ContractListComponent,
                pathMatch: 'full'
            },
            {
                path: 'add',
                component: ContractComponent,
                pathMatch: 'full'
            },
            {
                path: 'edit/:id',
                component: ContractComponent,
                pathMatch: 'full'
            },
            {
                path: 'renew/:id',
                component: ContractRenewComponent,
                pathMatch: 'full'
            },
            {
                path: 'detail/:id',
                component: ContractDetailComponent,
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: ContractDashboardComponent,
                pathMatch: 'full'
            },
        ]),
        FileModule,
    ],
    entryComponents: [
        ContractHistoryDetail,
        ContractTerminate
    ],
    providers: [

    ]
})

export class ContractModule { }
