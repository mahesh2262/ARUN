import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalDelegationComponent } from './approval-delegation.component';

describe('ApprovalDelegationComponent', () => {
  let component: ApprovalDelegationComponent;
  let fixture: ComponentFixture<ApprovalDelegationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalDelegationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalDelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
