import { Component, EventEmitter, Input, Output, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MainButton } from '../../../../shared/components/main-button/main-button';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, MainButton, MatIconModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input({ required: true }) totalPrice!: number;
  @Input() isSubmitting: boolean = false;
  @Output() checkout = new EventEmitter<void>();

  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
}
