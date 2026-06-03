import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StarRating } from '../../../../shared/components/star-rating/star-rating';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { ProfileReviewDto } from '../../../../core/models/review.models';

@Component({
  selector: 'app-profile-review-card',
  standalone: true,
  imports: [DatePipe, StarRating, SubButton],
  templateUrl: './profile-review-card.html',
  styleUrl: './profile-review-card.css',
})
export class ProfileReviewCard {
  @Input({ required: true }) review!: ProfileReviewDto;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.review.id);
  }
}
