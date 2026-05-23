import { Component, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-ui-icon-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule],
  templateUrl: './ui-icon-button.html',
  styleUrl: './ui-icon-button.css',
})
export class UiIconButton {
  @Input({ required: true }) icon!: string;
  @Input() variant: 'ghost' | 'filled' | 'outlined' = 'ghost';
  @Input() color: 'grey' | 'green' | 'pink' | 'white' = 'grey';
  @Input() shape: 'circle' | 'rounded' = 'circle';
  @Input() disabled: boolean = false;

  @Input() width: string = '52px';
  @Input() height: string = '52px';
  @Input() iconSize: string = '32px';

  @Input() public badgeCount: number = 0;

  @Output() btnClick = new EventEmitter<Event>();

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}
