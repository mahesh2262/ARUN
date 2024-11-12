import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentScreenComponent } from './document-screen.component';

describe('DocumentScreenComponent', () => {
  let component: DocumentScreenComponent;
  let fixture: ComponentFixture<DocumentScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
