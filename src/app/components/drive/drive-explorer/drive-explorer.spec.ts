import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveExplorer } from './drive-explorer';

describe('DriveExplorer', () => {
  let component: DriveExplorer;
  let fixture: ComponentFixture<DriveExplorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriveExplorer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriveExplorer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
