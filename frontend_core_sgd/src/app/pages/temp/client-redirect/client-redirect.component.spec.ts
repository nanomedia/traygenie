import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRedirectComponent } from './client-redirect.component';

describe('ClientRedirectComponent', () => {
  let component: ClientRedirectComponent;
  let fixture: ComponentFixture<ClientRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
