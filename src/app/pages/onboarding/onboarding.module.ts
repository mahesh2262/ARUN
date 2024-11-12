import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingLayoutComponent } from './onboarding-layout/onboarding-layout.component';
import { BankInfoComponent } from './bank-info/bank-info.component';
import { BankSecurityDepositComponent } from './bank-security-deposit/bank-security-deposit.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { CustomerLogComponent } from './customer-log/customer-log.component';
import { DocumentScreenComponent } from './document-screen/document-screen.component';
import { MarketInfoComponent } from './market-info/market-info.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AuthGuard } from '../../Guards/auth.guard';
import { AdditionalDataInfoComponent } from './additional-data-info/additional-data-info.component';

const routes: Routes = [
  {
    path: "approval",
    component: OnboardingLayoutComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    BankInfoComponent,
    BankSecurityDepositComponent,
    BusinessInfoComponent,
    CustomerLogComponent,
    DocumentScreenComponent,
    MarketInfoComponent,
    PersonalInfoComponent,
    OnboardingLayoutComponent,
    AdditionalDataInfoComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes),

  ]
})
export class OnboardingModule { }
