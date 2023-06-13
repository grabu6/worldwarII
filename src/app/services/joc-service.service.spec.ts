import { TestBed } from '@angular/core/testing';

import { JocServiceService } from './joc-service.service';

describe('JocServiceService', () => {
  let service: JocServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JocServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
