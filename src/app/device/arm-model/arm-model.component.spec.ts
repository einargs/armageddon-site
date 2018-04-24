import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmModelComponent } from './arm-model.component';

describe('ArmModelComponent', () => {
  let component: ArmModelComponent;
  let fixture: ComponentFixture<ArmModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
