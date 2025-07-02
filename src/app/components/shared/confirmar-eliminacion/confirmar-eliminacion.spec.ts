import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarEliminacion } from './confirmar-eliminacion';

describe('ConfirmarEliminacion', () => {
  let component: ConfirmarEliminacion;
  let fixture: ComponentFixture<ConfirmarEliminacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmarEliminacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarEliminacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
