import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MainButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private authService = inject(AuthService);

  authMessage: string | null = null;
  isSuccess: boolean = false;

  testAuth() {
    this.authService.checkAuthStatus().subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.authMessage = '✅ Ви успішно авторизовані! Сервер вас впізнав.';
        console.log('Відповідь сервера:', response);
      },
      error: (err) => {
        this.isSuccess = false;
        this.authMessage = '❌ Помилка доступу. Будь ласка, увійдіть в акаунт.';
        console.error('Помилка перевірки:', err);
      },
    });
  }
}
