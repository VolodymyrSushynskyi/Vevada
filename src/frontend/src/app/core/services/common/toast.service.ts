import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  private readonly duration = 5000;

  showSuccess(message: string): void {
    this.openToast(message, 'Закрити');
  }

  showError(message: string): void {
    this.openToast(message, 'Закрити');
  }

  showInfo(message: string): void {
    this.openToast(message, 'Ок');
  }

  private openToast(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['vevada-toast'],
    });
  }
}
