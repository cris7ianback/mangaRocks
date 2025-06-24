import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMuchosCapitulosDialog } from './add-muchos-capitulos-dialog';

describe('AddMuchosCapitulosDialog', () => {
  let component: AddMuchosCapitulosDialog;
  let fixture: ComponentFixture<AddMuchosCapitulosDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddMuchosCapitulosDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMuchosCapitulosDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
