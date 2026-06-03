import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReviewCard } from './profile-review-card';

describe('ProfileReviewCard', () => {
  let component: ProfileReviewCard;
  let fixture: ComponentFixture<ProfileReviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileReviewCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileReviewCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
