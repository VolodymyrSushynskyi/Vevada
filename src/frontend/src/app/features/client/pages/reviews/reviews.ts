import { Component } from '@angular/core';
import { ProfileReviewCard } from '../../components/profile-review-card/profile-review-card';
import { ProfileReviewDto } from '../../../../core/models/review.models';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ProfileReviewCard],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  mockReviews: ProfileReviewDto[] = [
    {
      id: 'r1',
      productName: 'Леопардовий костюм',
      mainImageUrl: '/img/leopard-leotard.jpg',
      rating: 4,
      text: 'Непоганий костюм. Якість непогана',
      createdAt: new Date('2026-05-28T10:00:00'),
    },
    {
      id: 'r2',
      productName: 'Костюм з діагональними смужками',
      mainImageUrl: '/img/pink-leotard2.jpg',
      rating: 1,
      text: 'Це жах! Чекали на доставку костюму більше місяця. Як так можно взагалі.\nЦе ж для дитини!!!!!!!!!!!!',
      createdAt: new Date('2026-03-22T11:00:00'),
    },
  ];

  handleDelete(id: string) {
    console.log('Видалення коментаря:', id);
    this.mockReviews = this.mockReviews.filter((r) => r.id !== id);
  }
}
