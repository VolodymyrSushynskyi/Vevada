import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLayuot } from './profile-layuot';

describe('ProfileLayuot', () => {
  let component: ProfileLayuot;
  let fixture: ComponentFixture<ProfileLayuot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLayuot],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileLayuot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
