import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { from } from 'rxjs/observable/from';

import { NavComponent } from "./nav/nav.component";
import { SpinComponent } from "./spin/spin.component";
import { PageLoaderComponent } from "./page.loader/page.loader.component";
// import { BrowserModule } from "@angular/platform-browser";
import { ToastComponent } from "./toast/toast.component";
import { MsgBoxComponent } from "./msgbox/msgbox.component";
import { MsgDialog } from "./msgbox/msgdialog.component";
import { MessageDialogComponent } from './dialogs/message.dialoge.component';
import { MaterialModule } from "../material/material.module";
// import { MatIconModule } from "@angular/material/icon";
// import { MatProgressBarModule } from "@angular/material";


import { EqualValidator } from './directives/equal-validator.directive';
import { BlockCopyPasteDirective } from './directives/blockCopyPaste.directive';
import { OnlyNumber } from './directives/onlyNumber.directive';
import { Trim, OnlyTrim } from './directives/trim.directive';

import { CommonModule } from '@angular/common';

import { HeaderComponent } from './secureHeaderFooter/header/header.component';
import { SidebarComponent } from './secureHeaderFooter/sidebar/sidebar.component';
import { FooterComponent } from './secureHeaderFooter/footer/footer.component';
import { HeaderNotificationComponent } from './secureHeaderFooter/notification/header.notification.component';

import { CollapseModule, BsDropdownModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';

import { ConfirmationDialogComponent } from './dialog-box/confirmation.dialog.component';


@NgModule({
    imports: [
        MaterialModule,
        // BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        // MatIconModule, 
        // MatProgressBarModule,
        CommonModule, RouterModule,

        NgxMatDrpModule,

        CollapseModule.forRoot(), BsDropdownModule.forRoot()
    ],

    declarations: [
        // NgxMatDrpModule,

        EqualValidator,
        BlockCopyPasteDirective,
        OnlyNumber,
        Trim, OnlyTrim,
        NavComponent, SpinComponent, PageLoaderComponent,
        ToastComponent,
        MsgBoxComponent, MsgDialog,
        HeaderComponent, SidebarComponent,
        HeaderNotificationComponent, FooterComponent,
        ConfirmationDialogComponent,

        MessageDialogComponent,
    ],

    exports: [
        NgxMatDrpModule,
        // MaterialModule, 
        BlockCopyPasteDirective, OnlyNumber, Trim, OnlyTrim,
        NavComponent, SpinComponent, PageLoaderComponent,
        ToastComponent, MsgBoxComponent, CommonModule,
        MsgDialog, HeaderComponent, SidebarComponent,
        HeaderNotificationComponent, FooterComponent, ConfirmationDialogComponent,
    ],

    entryComponents: [
        MsgDialog, ConfirmationDialogComponent,
        MessageDialogComponent
    ]
})
export class SharedModule {
}