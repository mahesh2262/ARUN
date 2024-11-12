import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChannelPartnersComponent } from './channel-partners/channel-partners.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { ApprovalScreenComponent } from './approval-screen/approval-screen.component';

import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { InitiatorScreenComponent } from './initiator-screen/initiator-screen.component';
import { AuthGuard } from '../../Guards/auth.guard';

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "channel-partner",
    component: ChannelPartnersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "approval",
    component: ApprovalScreenComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "profile-info",
    component: ProfileInfoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "initiator-screen",
    component: InitiatorScreenComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    ChannelPartnersComponent,
    ApprovalScreenComponent,
    ProfileInfoComponent,
    InitiatorScreenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class WebPagesModule { }
