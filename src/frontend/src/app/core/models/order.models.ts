import { OrderStatus } from '../constants/order-status';

export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  createdAt: Date | string;
  totalAmount: number;
  itemsCount: number;
  mainImageUrl: string;
  status: OrderStatus;
  statusMessage: string;
}

export interface OrderItemDto {
  id: string;
  productName: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  mainImageUrl: string;
}
