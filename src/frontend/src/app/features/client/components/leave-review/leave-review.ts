import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { StarRating } from '../../../../shared/components/star-rating/star-rating';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { CloseButton } from '../../../../shared/components/close-button/close-button';
import { ProductRewiewsService } from '../../../../core/services/client/product-reviews.service';
import { ToastService } from '../../../../core/services/common/toast.service';

@Component({
  selector: 'app-leave-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    StarRating,
    MainButton,
    CloseButton,
  ],
  templateUrl: './leave-review.html',
  styleUrl: './leave-review.css',
})
export class LeaveReview {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<LeaveReview>);
  private data = inject(MAT_DIALOG_DATA);
  private reviewsService = inject(ProductRewiewsService);
  private toastService = inject(ToastService);

  form: FormGroup = this.fb.group({
    rating: [0, [Validators.required, Validators.min(1)]],
    comment: [''],
  });

  isSubmitting = false;

  onRatingChange(newRating: number): void {
    this.form.get('rating')?.setValue(newRating);
  }

  close(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.showError('Будь ласка, поставте оцінку (від 1 до 5 зірок)');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      rating: this.form.value.rating,
      comment: this.form.value.comment,
    };

    this.reviewsService.leaveReview(this.data.productId, payload).subscribe({
      next: () => {
        this.toastService.showSuccess('Дякуємо! Ваш відгук успішно додано.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Помилка при відправці відгуку. Спробуйте пізніше.');
        this.isSubmitting = false;
      },
    });
  }
}
