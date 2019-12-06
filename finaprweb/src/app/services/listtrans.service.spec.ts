import { TestBed } from '@angular/core/testing';

import { ListtransService } from './listtrans.service';

describe('ListtransService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListtransService = TestBed.get(ListtransService);
    expect(service).toBeTruthy();
  });
});
