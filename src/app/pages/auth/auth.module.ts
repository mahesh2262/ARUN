import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { OtpPageComponent } from './otp-page/otp-page.component';
import { NgOtpInputModule } from 'ng-otp-input';



const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'otp',
    component: OtpPageComponent,
  },
];

@NgModule({
  declarations: [
    LoginPageComponent,
    ForgotPasswordComponent,
    OtpPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    NgOtpInputModule
  ]
})
export class AuthModule { }
