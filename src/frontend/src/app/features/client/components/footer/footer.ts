import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HorizontalList } from '../../../../shared/components/horizontal-list/horizontal-list';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, HorizontalList, BrandLogoWithText, UiIconButton],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  public openSocialLink(network: string): void {
    const links: Record<string, string> = {
      instagram: 'https://www.instagram.com/',
      pinterest: 'https://ru.pinterest.com/',
      telegram: 'https://web.telegram.org/k/',
      viber: 'https://www.viber.com/ru/',
    };

    const url = links[network];

    if (this.isBrowser && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
}
