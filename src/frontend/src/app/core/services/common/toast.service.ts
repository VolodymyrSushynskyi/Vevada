import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  private duration = 5000;

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['vevada-toast'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Закрыть', {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['vevada-toast'],
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'Ок', {
      duration: this.duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
