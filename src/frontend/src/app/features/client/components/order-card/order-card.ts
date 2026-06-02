import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatusStepper } from '../order-status-stepper/order-status-stepper';
import { OrderStatusChip } from '../order-status-chip/order-status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { OrderStatus } from '../../../../core/constants/order-status';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [DatePipe, OrderStatusStepper, OrderStatusChip, MainButton, SubButton],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input({ required: true }) order!: OrderSummaryDto;

  @Output() viewDetails = new EventEmitter<string>();
  @Output() cancelOrder = new EventEmitter<string>();

  onViewDetails() {
    this.viewDetails.emit(this.order.id);
  }

  onCancelOrder() {
    this.cancelOrder.emit(this.order.id);
  }

  get canCancel(): boolean {
    return this.order.status === OrderStatus.Pending || this.order.status === OrderStatus.Accepted;
  }
}
