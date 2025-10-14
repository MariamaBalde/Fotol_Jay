import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteProduit } from './carte-produit';

describe('CarteProduit', () => {
  let component: CarteProduit;
  let fixture: ComponentFixture<CarteProduit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteProduit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteProduit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
