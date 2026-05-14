import { TestBed } from '@angular/core/testing';

import { IconRegistration } from './icon-registration';

describe('IconRegistration', () => {
  let service: IconRegistration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconRegistration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
