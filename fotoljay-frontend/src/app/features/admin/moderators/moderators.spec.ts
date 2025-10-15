import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Moderators } from './moderators';

describe('Moderators', () => {
  let component: Moderators;
  let fixture: ComponentFixture<Moderators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Moderators]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Moderators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
