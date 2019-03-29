import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogRef, MatDialogModule } from '@angular/material';

import { MaterialModule } from "../../material/material.module";

import { UploadMediaComponent } from './upload.media.component';

import { SharedModule } from "../../shared/shared.module";
import { CommonModule } from "@angular/common";

import { FileUploadComponent } from './file-upload/file.upload.component';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { ImagePreview } from './image-preview.directive';
import { FileUploadModule } from 'ng2-file-upload';
import { VideoModule } from './video/video.component';
import { LightboxModule } from 'angular2-lightbox';
import { ImageGallery } from './image-gallery/image.gallery.component';

@NgModule({

    imports: [
        CommonModule,
        MaterialModule, SharedModule,
        // TextMaskModule, MultiselectDropdownModule, 
        // MyDateRangePickerModule, DatepickerModule,
        // AppRoutingModule, 
        // BrowserModule, 
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule, FileUploadModule,
        LightboxModule,
        // CalendarModule.forRoot()
    ],
    declarations: [
        UploadMediaComponent,
        ImagePreview,
        VideoModule,
        ImageGallery,
        // CalenderComponent,
        FileUploadComponent,
    ],

    exports: [
        UploadMediaComponent,
        // ImagePreview,
        // VideoModule,
        // ImageGallery,
    ],

    entryComponents: []
})
export class UploadModule {
}
