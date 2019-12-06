import { TestBed } from '@angular/core/testing';

import { ResetpassService } from './resetpass.service';

describe('ResetpassService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResetpassService = TestBed.get(ResetpassService);
    expect(service).toBeTruthy();
  });
});
