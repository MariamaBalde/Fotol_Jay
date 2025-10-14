import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleCamera } from './modale-camera';

describe('ModaleCamera', () => {
  let component: ModaleCamera;
  let fixture: ComponentFixture<ModaleCamera>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleCamera]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleCamera);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
