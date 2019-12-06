import { TestBed } from '@angular/core/testing';

import { MasterReferenceService } from './master-reference.service';

describe('MasterReferenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterReferenceService = TestBed.get(MasterReferenceService);
    expect(service).toBeTruthy();
  });
});
