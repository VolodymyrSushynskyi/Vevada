import { Component, Input, OnInit, inject, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import { StarRating } from '../../../../shared/components/star-rating/star-rating';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { LeaveReview } from '../leave-review/leave-review';
import { ToastService } from '../../../../core/services/common/toast.service';

import { ProductRewiewsService } from '../../../../core/services/client/product-reviews.service';
import { ProductReviewDto } from '../../../../core/models/product-reviews.models';
import { SessionService } from '../../../../core/services/auth/session.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    StarRating,
    MainButton,
    SubButton,
  ],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  @Input({ required: true }) productId!: string;

  private reviewsService = inject(ProductRewiewsService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private sessionService = inject(SessionService);

  isUserAuthenticated = false;

  currentPage = 1;
  pageSize = 3;
  reviews: ProductReviewDto[] = [];
  totalReviews = 0;
  averageRating = 0;
  isLoading = true;

  ngOnInit(): void {
    this.isUserAuthenticated = this.sessionService.isAuthenticated();

    if (this.productId) {
      this.loadReviews();
    }
  }

  loadReviews(): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.cdr.markForCheck();

    this.reviewsService
      .getReviews(this.productId, 1, 3)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.reviews = response.items || [];
          this.totalReviews = response.totalCount || this.reviews.length;

          this.calculateAverageRating();

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toastService.showError('Помилка завантаження відгуків');
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  loadMoreReviews(): void {
    this.currentPage++;

    this.reviewsService
      .getReviews(this.productId, this.currentPage, this.pageSize)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const newReviews = response.items || [];
          this.reviews = [...this.reviews, ...newReviews];
          this.calculateAverageRating();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toastService.showError('Помилка завантаження відгуків');
          this.currentPage--;
          this.cdr.markForCheck();
        },
      });
  }

  private calculateAverageRating(): void {
    if (this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }

  openAddReviewModal(): void {
    const dialogRef = this.dialog.open(LeaveReview, {
      width: '600px',
      maxWidth: '95vw',
      data: { productId: this.productId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReviews();
      }
    });
  }
}
