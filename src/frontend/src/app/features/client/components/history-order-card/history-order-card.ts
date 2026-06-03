import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatusChip } from '../order-status-chip/order-status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';

@Component({
  selector: 'app-history-order-card',
  standalone: true,
  imports: [DatePipe, OrderStatusChip, MainButton],
  templateUrl: './history-order-card.html',
  styleUrl: './history-order-card.css',
})
export class HistoryOrderCard {
  @Input({ required: true }) order!: OrderSummaryDto;
  @Output() viewDetails = new EventEmitter<string>();

  onViewDetails() {
    this.viewDetails.emit(this.order.id);
  }
}
