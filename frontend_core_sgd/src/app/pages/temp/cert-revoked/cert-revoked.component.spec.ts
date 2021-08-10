import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertRevokedComponent } from './cert-revoked.component';

describe('CertRevokedComponent', () => {
  let component: CertRevokedComponent;
  let fixture: ComponentFixture<CertRevokedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertRevokedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertRevokedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
