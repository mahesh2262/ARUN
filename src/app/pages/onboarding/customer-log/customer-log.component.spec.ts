import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLogComponent } from './customer-log.component';

describe('CustomerLogComponent', () => {
  let component: CustomerLogComponent;
  let fixture: ComponentFixture<CustomerLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
