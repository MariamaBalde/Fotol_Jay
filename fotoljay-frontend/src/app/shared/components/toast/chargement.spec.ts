import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chargement } from './toast.component';

describe('Chargement', () => {
  let component: Chargement;
  let fixture: ComponentFixture<Chargement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chargement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chargement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
