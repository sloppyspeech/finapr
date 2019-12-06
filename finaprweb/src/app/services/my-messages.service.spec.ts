import { TestBed } from '@angular/core/testing';

import { MyMessagesService } from './my-messages.service';

describe('MyMessagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyMessagesService = TestBed.get(MyMessagesService);
    expect(service).toBeTruthy();
  });
});
