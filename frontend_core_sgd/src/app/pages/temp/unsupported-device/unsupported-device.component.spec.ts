import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedDeviceComponent } from './unsupported-device.component';

describe('UnsupportedDeviceComponent', () => {
  let component: UnsupportedDeviceComponent;
  let fixture: ComponentFixture<UnsupportedDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsupportedDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
