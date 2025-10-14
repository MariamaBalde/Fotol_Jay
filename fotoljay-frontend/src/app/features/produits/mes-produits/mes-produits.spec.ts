import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesProduits } from './mes-produits';

describe('MesProduits', () => {
  let component: MesProduits;
  let fixture: ComponentFixture<MesProduits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesProduits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesProduits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
