import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconRegistration {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  public registerIcons(): void {
    if (isPlatformBrowser(this.platformId)) {
      const icons = [
        { name: 'icon-close', path: 'icons/x.svg' },
        { name: 'icon-arrow-right', path: 'icons/arrow-right.svg' },
        { name: 'icon-arrow-left', path: 'icons/arrow-left.svg' },
        { name: 'icon-white-logo', path: 'icons/white-logo.svg' },
        { name: 'icon-green-logo', path: 'icons/green-logo.svg' },
        { name: 'icon-heart', path: 'icons/heart.svg' },
        { name: 'icon-cart', path: 'icons/cart.svg' },
        { name: 'icon-user', path: 'icons/user.svg' },
      ];

      icons.forEach((icon) => {
        this.matIconRegistry.addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path),
        );
      });
    }
  }
}
