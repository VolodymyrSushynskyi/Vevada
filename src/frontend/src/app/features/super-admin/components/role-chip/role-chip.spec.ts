import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleChip } from './role-chip';

describe('RoleChip', () => {
  let component: RoleChip;
  let fixture: ComponentFixture<RoleChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleChip],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
