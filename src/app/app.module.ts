import { APP_BASE_HREF } from '@angular/common';

import { environment } from '../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { AuthModule } from "./view/auth/auth.module";
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { MaterialModule } from './material/material.module';
// import { MatIconModule } from "@angular/material/icon";



import { AppComponent } from './app.component';

// import { MainComponent } from './main/main.component';
// import { MainHeader } from './main/main-header/main-header.component';
import { MainModule } from './main/main.module';
import { UploadModule } from './view/upload-media/upload.module';
// import { CovalentFileModule } from '@covalent/core/file';

import { WelcomeComponent } from './view/test/welcome.component';
import { NotFoundComponent } from './others/not-found.component';
import { PermissionDeniedComponent } from './others/permission.denied.component';


import { CanActivateViaAuthGuard } from './core/security/auth.guard';
import { CanActivateViaMainGuard } from './core/security/main.page.gurad';

import { SharedModule } from './shared/shared.module';
import { AuthService } from './core/services/auth/auth.service';


// import { BlockCopyPasteDirective } from './shared/directives/blockCopyPaste.directive';


@NgModule({
  declarations: [
    AppComponent,

    // MainComponent,
    WelcomeComponent,
    NotFoundComponent,
    PermissionDeniedComponent,
    // BlockCopyPasteDirective,

  ],
  imports: [
    MainModule,
    AngularFontAwesomeModule,


    CoreModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,

    SharedModule,

    MaterialModule,
    // MatIconModule,

    AppRoutingModule,
    UploadModule, 

  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/' + (environment.webAppUrl || '')
    },
    CanActivateViaAuthGuard,
    CanActivateViaMainGuard
  ],
  entryComponents: [

  ],
  bootstrap: [AppComponent,]


})
export class AppModule { }
