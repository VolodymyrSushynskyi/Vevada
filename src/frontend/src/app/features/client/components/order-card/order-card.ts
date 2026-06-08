import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderDto } from '../../../../core/models/order.models';
import { OrderStatusStepper } from '../order-status-stepper/order-status-stepper';
import { OrderStatusChip } from '../order-status-chip/order-status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { OrderStatus } from '../../../../core/constants/order-status';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [DatePipe, OrderStatusStepper, OrderStatusChip, MainButton, SubButton, ImageUrlPipe],
  templateUrl: './order-card.html',
  styleUrl: './order-card.css',
})
export class OrderCard {
  @Input({ required: true }) order!: OrderDto;

  @Output() viewDetails = new EventEmitter<number>();
  @Output() cancelOrder = new EventEmitter<number>();

  onViewDetails() {
    this.viewDetails.emit(this.order.orderId);
  }

  onCancelOrder() {
    this.cancelOrder.emit(this.order.orderId);
  }

  get canCancel(): boolean {
    return this.order.status === OrderStatus.Pending || this.order.status === OrderStatus.Accepted;
  }

  get firstImageId(): string | null {
    return this.order.items && this.order.items.length > 0 ? this.order.items[0].imageId : null;
  }
}
