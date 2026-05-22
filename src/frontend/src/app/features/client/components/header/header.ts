import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';
import { HorizontalList } from '../../../../shared/components/horizontal-list/horizontal-list';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MatBadgeModule, UiIconButton, BrandLogoWithText, HorizontalList],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public cartItemsCount: number = 2;
  public isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  public onUserIconClick(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
