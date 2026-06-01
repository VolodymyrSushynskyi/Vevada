import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating implements OnChanges {
  @Input() rating: number = 0;
  @Input() maxStars: number = 5;
  @Input() readonly: boolean = true;
  @Input() size: string = '24px';
  @Output() ratingChange = new EventEmitter<number>();

  stars: { fillPercentage: number }[] = [];

  uniqueId: string = Math.random().toString(36).substring(2, 9);

  ngOnChanges(): void {
    this.calculateStars();
  }

  private calculateStars(): void {
    this.stars = [];
    for (let i = 1; i <= this.maxStars; i++) {
      let fillPercentage = 0;

      if (this.rating >= i) {
        fillPercentage = 100;
      } else if (this.rating > i - 1) {
        fillPercentage = Math.round((this.rating - (i - 1)) * 100);
      }

      this.stars.push({ fillPercentage });
    }
  }

  onRate(newRating: number): void {
    if (!this.readonly) {
      this.rating = newRating;
      this.calculateStars();
      this.ratingChange.emit(this.rating);
    }
  }
}
