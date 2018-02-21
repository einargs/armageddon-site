import { TestBed, inject } from '@angular/core/testing';

import { DeviceListerService } from './device-lister.service';

describe('DeviceListerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceListerService]
    });
  });

  it('should be created', inject([DeviceListerService], (service: DeviceListerService) => {
    expect(service).toBeTruthy();
  }));
});
