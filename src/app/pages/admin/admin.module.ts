import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { ApprovalDelegationComponent } from './approval-delegation/approval-delegation.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { MasterDataManagementComponent } from './master-data-management/master-data-management.component';
import { TerritoryMasterComponent } from './territory-master/territory-master.component';
import { AuthGuard } from '../../Guards/auth.guard';
import { MasterModule } from './master/master.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailSettingComponent } from './email-setting/email-setting.component';




const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "approval-delegation",
    component: ApprovalDelegationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "master-data-management",
    component: MasterDataManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "territory-master",
    component: TerritoryMasterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "email-setting",
    component: EmailSettingComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    ApprovalDelegationComponent,
    MasterDataManagementComponent,
    TerritoryMasterComponent,
    DashboardComponent,
    EmailSettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MasterModule
  ]
})
export class AdminModule { }
