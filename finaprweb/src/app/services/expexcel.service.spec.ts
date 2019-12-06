import { TestBed } from '@angular/core/testing';

import { ExpexcelService } from './expexcel.service';

describe('ExpexcelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExpexcelService = TestBed.get(ExpexcelService);
    expect(service).toBeTruthy();
  });
});
