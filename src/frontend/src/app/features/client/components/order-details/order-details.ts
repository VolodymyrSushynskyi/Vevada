import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

import { CloseButton } from '../../../../shared/components/close-button/close-button';
import { HorizontalProductCard } from '../horizontal-product-card/horizontal-product-card';
import { OrderItemDto } from '../../../../core/models/order.models';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

export interface OrderDetailsDialogData {
  orderNumber: string;
  items: OrderItemDto[];
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatDividerModule,
    CloseButton,
    HorizontalProductCard,
    ImageUrlPipe,
  ],
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
