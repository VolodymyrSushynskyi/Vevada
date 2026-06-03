import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSidbar } from './profile-sidbar';

describe('ProfileSidbar', () => {
  let component: ProfileSidbar;
  let fixture: ComponentFixture<ProfileSidbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSidbar],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSidbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
