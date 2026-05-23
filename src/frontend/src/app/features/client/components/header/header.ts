import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { BrandLogo } from '../../../../shared/components/brand-logo/brand-logo';
import { HorizontalList } from '../../../../shared/components/horizontal-list/horizontal-list';
import { SessionService } from '../../../../core/services/auth/session.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, UiIconButton, BrandLogo, HorizontalList],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private sessionService = inject(SessionService);
  private router = inject(Router);

  public cartItemsCount: number = 2;

  public onUserIconClick(): void {
    const isLoggedIn = this.sessionService.isAuthenticated();

    if (isLoggedIn) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
