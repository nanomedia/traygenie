import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivoTokenComponent } from './dispositivo-token.component';

describe('DispositivoTokenComponent', () => {
  let component: DispositivoTokenComponent;
  let fixture: ComponentFixture<DispositivoTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispositivoTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispositivoTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
