import { TestBed, inject } from '@angular/core/testing';

import { DeviceControllerService } from './device-controller.service';

describe('DeviceControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceControllerService]
    });
  });

  it('should be created', inject([DeviceControllerService], (service: DeviceControllerService) => {
    expect(service).toBeTruthy();
  }));
});
