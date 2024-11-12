import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatorScreenComponent } from './initiator-screen.component';

describe('InitiatorScreenComponent', () => {
  let component: InitiatorScreenComponent;
  let fixture: ComponentFixture<InitiatorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatorScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiatorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
