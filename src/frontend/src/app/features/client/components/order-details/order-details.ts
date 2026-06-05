import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CloseButton } from '../../../../shared/components/close-button/close-button'; //
import { HorizontalProductCard } from '../horizontal-product-card/horizontal-product-card';
import { OrderItemDto } from '../../../../core/models/order.models';

export interface OrderDetailsDialogData {
  orderNumber: string;
  items: OrderItemDto[];
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [MatDialogModule, CloseButton, HorizontalProductCard],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
})
export class OrderDetails {
  constructor(
    public dialogRef: MatDialogRef<OrderDetails>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailsDialogData,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
