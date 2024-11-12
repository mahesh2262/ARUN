import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalNotificationComponent } from './approval-notification/approval-notification.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
  declarations: [
    ApprovalNotificationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [ApprovalNotificationComponent]
})
export class MasterModule { }
