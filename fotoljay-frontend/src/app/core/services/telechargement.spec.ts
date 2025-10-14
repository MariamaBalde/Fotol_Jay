import { TestBed } from '@angular/core/testing';

import { Telechargement } from './telechargement';

describe('Telechargement', () => {
  let service: Telechargement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Telechargement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
