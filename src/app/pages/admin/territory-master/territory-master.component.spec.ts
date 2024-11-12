import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerritoryMasterComponent } from './territory-master.component';

describe('TerritoryMasterComponent', () => {
  let component: TerritoryMasterComponent;
  let fixture: ComponentFixture<TerritoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerritoryMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerritoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
