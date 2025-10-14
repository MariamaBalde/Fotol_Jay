import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierProfil } from './modifier-profil';

describe('ModifierProfil', () => {
  let component: ModifierProfil;
  let fixture: ComponentFixture<ModifierProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierProfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
