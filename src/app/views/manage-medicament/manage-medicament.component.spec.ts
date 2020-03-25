import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMedicamentComponent } from './manage-medicament.component';

describe('ManageMedicamentComponent', () => {
  let component: ManageMedicamentComponent;
  let fixture: ComponentFixture<ManageMedicamentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMedicamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMedicamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
