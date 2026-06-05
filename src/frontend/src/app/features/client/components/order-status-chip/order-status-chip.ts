import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { OrderStatus } from '../../../../core/constants/order-status';

@Component({
  selector: 'app-order-status-chip',
  standalone: true,
  imports: [NgClass],
  templateUrl: './order-status-chip.html',
  styleUrl: './order-status-chip.css',
})
export class OrderStatusChip {
  @Input({ required: true }) status!: OrderStatus;

  get statusLabel(): string {
    switch (this.status) {
      case OrderStatus.Pending:
      case OrderStatus.Accepted:
        return 'В обробці';
      case OrderStatus.Manufacturing:
        return 'Комплектується';
      case OrderStatus.Shipped:
        return 'Відправлено';
      case OrderStatus.Completed:
        return 'Виконано';
      case OrderStatus.Cancelled:
        return 'Скасовано';
      default:
        return '';
    }
  }

  get chipThemeClass(): string {
    switch (this.status) {
      case OrderStatus.Pending:
      case OrderStatus.Accepted:
        return 'theme-processing';
      case OrderStatus.Manufacturing:
        return 'theme-manufacturing';
      case OrderStatus.Shipped:
      case OrderStatus.Completed:
        return 'theme-success';
      case OrderStatus.Cancelled:
        return 'theme-cancelled';
      default:
        return 'theme-default';
    }
  }
}
