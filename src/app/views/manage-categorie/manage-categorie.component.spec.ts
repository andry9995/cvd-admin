import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCategorieComponent } from './manage-categorie.component';

describe('ManageCategorieComponent', () => {
  let component: ManageCategorieComponent;
  let fixture: ComponentFixture<ManageCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
