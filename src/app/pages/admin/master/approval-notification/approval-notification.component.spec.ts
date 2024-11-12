import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalNotificationComponent } from './approval-notification.component';

describe('ApprovalNotificationComponent', () => {
  let component: ApprovalNotificationComponent;
  let fixture: ComponentFixture<ApprovalNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalNotificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
