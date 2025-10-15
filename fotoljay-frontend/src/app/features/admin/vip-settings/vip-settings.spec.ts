import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VipSettings } from './vip-settings';

describe('VipSettings', () => {
  let component: VipSettings;
  let fixture: ComponentFixture<VipSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VipSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VipSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
