import { Component, Input } from '@angular/core';
import { OrderStatus } from '../../../../core/constants/order-status';

@Component({
  selector: 'app-order-status-stepper',
  standalone: true,
  imports: [],
  templateUrl: './order-status-stepper.html',
  styleUrl: './order-status-stepper.css',
})
export class OrderStatusStepper {
  @Input({ required: true }) status!: OrderStatus;

  steps = [
    { id: 1, label: 'В обробці' },
    { id: 2, label: 'Прийнято' },
    { id: 3, label: 'Комплектується' },
    { id: 4, label: 'Відправлено' },
    { id: 5, label: 'Доставлено' },
  ];

  get activeStepIndex(): number {
    if (this.status === OrderStatus.Cancelled) {
      return 0;
    }

    switch (this.status) {
      case OrderStatus.Pending:
        return 1;
      case OrderStatus.Accepted:
        return 2;
      case OrderStatus.Manufacturing:
        return 3;
      case OrderStatus.Shipped:
        return 4;
      case OrderStatus.Completed:
        return 5;
      default:
        return 0;
    }
  }

  get isCancelled(): boolean {
    return this.status === OrderStatus.Cancelled;
  }
}
