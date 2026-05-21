import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconRegistration {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {}

  public registerIcons(): void {
    const icons = [
      { name: 'icon-close', path: 'icons/x.svg' },
      { name: 'icon-arrow-right', path: 'icons/arrow-right.svg' },
      { name: 'icon-arrow-left', path: 'icons/arrow-left.svg' },
      { name: 'icon-white-logo', path: 'icons/white-logo.svg' },
      { name: 'icon-green-logo', path: 'icons/green-logo.svg' },
    ];

    icons.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path),
      );
    });
  }
}
