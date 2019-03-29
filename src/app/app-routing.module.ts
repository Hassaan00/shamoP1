import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuard } from './core/security/auth.guard';
import { CanActivateViaMainGuard } from './core/security/main.page.gurad';

// import { MainComponent } from './main/main.component';
import { LoginComponent } from './view/auth/login/login.component';
import { RegistrationComponent } from './view/auth/registration/registration.component';
import { ResendVerificationComponent } from './view/auth/verfication/resend-verification.component';
import { VerificationComponent } from './view/auth/verfication/verification.component';
import { ForgotPasswordComponent } from './view/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './view/auth/forgot-password/reset-password.component';
import { WelcomeComponent } from './view/test/welcome.component';
import { NotFoundComponent } from './others/not-found.component';
import { PermissionDeniedComponent } from './others/permission.denied.component';
import { LogoutComponent } from './view/auth/logout/logout.component';


import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [CanActivateViaMainGuard],
    children: [],
  },
  {
    path: 'login',
    component: LoginComponent,
    children: []
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [CanActivateViaMainGuard],
    children: []
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [CanActivateViaMainGuard],
    children: []
  },
  {
    path: 'resend-verification',
    component: ResendVerificationComponent,
    canActivate: [CanActivateViaMainGuard],
    children: []
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [CanActivateViaMainGuard],
    children: []
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [CanActivateViaMainGuard],
    children: []
  },
  {
    path: 'home',
    loadChildren: './view/home/home.module#HomeModule',
    // pathMatch: 'full',
    // component: HomeComponent,
    canActivate: [CanActivateViaAuthGuard],
    // children: []
  },
  {
    path: 'user',
    loadChildren: './view/user/user.module#UserModule',
    canActivate: [CanActivateViaAuthGuard],
    // children: []
  },
  {
    path: 'admin',
    loadChildren: './view/admin/admin.module#AdminModule',
    canActivate: [CanActivateViaAuthGuard],
    // children: []
  },
  {
    path: 'contract',
    loadChildren: './view/contract/contract.module#ContractModule',
    canActivate: [CanActivateViaAuthGuard],
  },
  {
    path: 'payment',
    loadChildren: './view/payment/payment.module#PaymentModule',
    canActivate: [CanActivateViaAuthGuard],
    // children: []
  },
  {
    path: 'error',
    component: NotFoundComponent,
    // canActivate: [CanActivateViaAuthGuard],
    children: []
  },
  {
    path: 'permission',
    component: PermissionDeniedComponent,
    // canActivate: [CanActivateViaAuthGuard],
    children: []
  },
  {
    path: 'logout',
    component: LogoutComponent,
    children: []
  },
  { path: 'welcome', component: WelcomeComponent },
  // { path: 'welcome', redirectTo: '', pathMatch: 'full' },
  // { path: '', component: WelcomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]

})
export class AppRoutingModule { }
