import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeritoryTemplateComponent } from './teritory-template.component';

describe('TeritoryTemplateComponent', () => {
  let component: TeritoryTemplateComponent;
  let fixture: ComponentFixture<TeritoryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeritoryTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeritoryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
