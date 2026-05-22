import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAuth } from './admin-auth';

describe('AdminAuth', () => {
  let component: AdminAuth;
  let fixture: ComponentFixture<AdminAuth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAuth],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAuth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
