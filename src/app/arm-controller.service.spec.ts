import { TestBed, inject } from '@angular/core/testing';

import { ArmControllerService } from './arm-controller.service';

describe('ArmControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArmControllerService]
    });
  });

  it('should be created', inject([ArmControllerService], (service: ArmControllerService) => {
    expect(service).toBeTruthy();
  }));
});
