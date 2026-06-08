import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';

export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  createdAt: string | Date;
  totalAmount: number;
  itemsCount: number;
  mainImageUrl: string;
  status: OrderStatus;
  statusMessage: string;
}

@Component({
  selector: 'app-manufacturer-order-card',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MainButton, SubButton],
  templateUrl: './manufacturer-order-card.html',
  styleUrl: './manufacturer-order-card.css',
})
export class ManufacturerOrderCard {
  @Input({ required: true }) order!: OrderSummaryDto & { clientCancellationRequested?: boolean };

  @Output() viewDetails = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ orderId: string; newStatus: OrderStatus }>();
  @Output() refuse = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<string>();

  public OrderStatus = OrderStatus;

  get availableStatuses() {
    const statuses = [
      { id: OrderStatus.Accepted, name: 'Прийнято' },
      { id: OrderStatus.Manufacturing, name: 'В роботі' },
      { id: OrderStatus.Shipped, name: 'Відправлено' },
      { id: OrderStatus.Completed, name: 'Виконано' },
    ];

    return statuses.filter((s) => s.id >= this.order.status);
  }

  onStatusSelect(newStatus: OrderStatus): void {
    if (newStatus !== this.order.status) {
      this.statusChange.emit({ orderId: this.order.id, newStatus });
    }
  }
}
