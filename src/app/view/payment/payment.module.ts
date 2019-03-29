import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from "../../material/material.module";
import { SharedModule } from '../../shared/shared.module';
// import { UploadModule } from '../upload-media/upload.module';
// import { FileModule } from '../file/file.module';

import { PaymentAddComponent } from './payment.add/payment.add.component';
import { PaymentDetailComponent } from './payment.detail/payment.detail.component';
import { PaymentListComponent } from './payment.list/payment.list.component';
// import { LawFirmAddComponent } from '../lawFirm/lawFirm.add.component';
// import { UserFilterPipe } from '../pipes/user-filter.pipe';
import { FileComponent } from './upload.file/file.component';

import { CommonModule } from "@angular/common";
import { MatNativeDateModule } from '@angular/material';


@NgModule({
    declarations: [
        PaymentListComponent,
        PaymentAddComponent,
        PaymentDetailComponent,
        FileComponent,
        // CaseDetailComponent, GiveObservation, ViewObservation,
        // EndorsementRecommendation, ViewRecommendationAction,
        // AddMilestoneField, GiveDocumentObservation,
        // DefaulterAccountDetails,
        // LawFirmAddComponent,
        // UserFilterPipe
    ],
    imports: [

        CommonModule,
        SharedModule,
        FormsModule, ReactiveFormsModule,
        MaterialModule,
        MatNativeDateModule,

        RouterModule.forChild([
            {
                path: 'p/add',
                component: PaymentAddComponent
            },
            {
                path: 'p/update/:id',
                component: PaymentAddComponent
            },
            // {
            //     path: 'p/detail/:id',
            //     component: PaymentDetailComponent
            // },
            {
                path: 'p/list',
                component: PaymentListComponent
            },
            { path: '**', redirectTo: '/', pathMatch: 'full' }
        ]),
        // UploadModule,
        // FileModule,
    ],
    entryComponents: [
    ],
    providers: [
        // ProductService,
        // ProductDetailGuard
    ]
})

export class PaymentModule { }