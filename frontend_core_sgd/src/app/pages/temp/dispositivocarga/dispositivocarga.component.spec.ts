import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivocargaComponent } from './dispositivocarga.component';

describe('DispositivocargaComponent', () => {
  let component: DispositivocargaComponent;
  let fixture: ComponentFixture<DispositivocargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispositivocargaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispositivocargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
