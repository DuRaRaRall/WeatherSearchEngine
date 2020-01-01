import { TestBed } from '@angular/core/testing';

import { SearchAndClearServiceService } from './search-and-clear-service.service';

describe('SearchAndClearServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchAndClearServiceService = TestBed.get(SearchAndClearServiceService);
    expect(service).toBeTruthy();
  });
});
