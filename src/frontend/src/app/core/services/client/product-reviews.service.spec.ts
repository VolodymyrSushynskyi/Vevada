import { TestBed } from '@angular/core/testing';

import { ProductRewiewsService } from './product-rewiews.service';

describe('ProductRewiewsService', () => {
  let service: ProductRewiewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRewiewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
