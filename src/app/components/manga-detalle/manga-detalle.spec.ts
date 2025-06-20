import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaDetalle } from './manga-detalle';

describe('MangaDetalle', () => {
  let component: MangaDetalle;
  let fixture: ComponentFixture<MangaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MangaDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangaDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
