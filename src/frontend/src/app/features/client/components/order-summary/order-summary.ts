import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainButton } from '../../../../shared/components/main-button/main-button';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [MainButton, MatIconModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input({ required: true }) totalPrice!: number;
  @Input() isSubmitting: boolean = false;
  @Output() checkout = new EventEmitter<void>();
}
