import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './brand-logo.html',
  styleUrl: './brand-logo.css',
})
export class BrandLogo {
  @Input() public theme: 'white' | 'green' = 'green';
  @Input() public iconSize: string = '32px';

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  public get iconName(): string {
    return this.theme === 'white' ? 'icon-white-logo' : 'icon-green-logo';
  }
}
