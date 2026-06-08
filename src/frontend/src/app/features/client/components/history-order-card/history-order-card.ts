import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderDto } from '../../../../core/models/order.models';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { OrderStatusChip } from '../order-status-chip/order-status-chip';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-history-order-card',
  standalone: true,
  imports: [CommonModule, DatePipe, MainButton, OrderStatusChip, ImageUrlPipe],
  templateUrl: './history-order-card.html',
  styleUrl: './history-order-card.css',
})
export class HistoryOrderCard {
  @Input({ required: true }) order!: OrderDto;
  @Output() viewDetails = new EventEmitter<number>();

  get firstImageId(): string | null {
    return this.order.items && this.order.items.length > 0 ? this.order.items[0].imageId : null;
  }
}
