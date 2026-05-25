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
        { name: 'icon-map-pin', path: 'icons/map-pin.svg' },
        { name: 'icon-envelope', path: 'icons/envelope.svg' },
        { name: 'icon-phone', path: 'icons/phone.svg' },
        { name: 'icon-instagram-logo', path: 'icons/instagram-logo.svg' },
        { name: 'icon-pinterest-logo', path: 'icons/pinterest-logo.svg' },
        { name: 'icon-viber-logo', path: 'icons/viber-logo.svg' },
        { name: 'icon-telegram-logo', path: 'icons/telegram-logo.svg' },
        { name: 'icon-pencil', path: 'icons/pencil.svg' },
        { name: 'icon-trash', path: 'icons/trash.svg' },
        { name: 'icon-sign-out', path: 'icons/sign-out.svg' },
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
