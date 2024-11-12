import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSecurityDepositComponent } from './bank-security-deposit.component';

describe('BankSecurityDepositComponent', () => {
  let component: BankSecurityDepositComponent;
  let fixture: ComponentFixture<BankSecurityDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankSecurityDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankSecurityDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
