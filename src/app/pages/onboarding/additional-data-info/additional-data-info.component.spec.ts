import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalDataInfoComponent } from './additional-data-info.component';

describe('AdditionalDataInfoComponent', () => {
  let component: AdditionalDataInfoComponent;
  let fixture: ComponentFixture<AdditionalDataInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalDataInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalDataInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
