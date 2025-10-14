import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerProduit } from './creer-produit';

describe('CreerProduit', () => {
  let component: CreerProduit;
  let fixture: ComponentFixture<CreerProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerProduit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
