import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { SessionService } from '../../../../core/services/auth/session.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, BrandLogoWithText, SubButton],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => this.handleLogoutSuccess(),
      error: (err) => {
        console.error('Ошибка во время логаута на сервере', err);
        this.handleLogoutSuccess();
      },
    });
  }

  private handleLogoutSuccess(): void {
    this.sessionService.clearSession();
    this.router.navigate(['/admin/login']);
  }
}
