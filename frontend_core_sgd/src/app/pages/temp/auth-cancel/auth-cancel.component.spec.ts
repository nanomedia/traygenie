import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCancelComponent } from './auth-cancel.component';

describe('AuthCancelComponent', () => {
  let component: AuthCancelComponent;
  let fixture: ComponentFixture<AuthCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
