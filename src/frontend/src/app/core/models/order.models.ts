import { OrderStatus } from '../constants/order-status';

export interface OrderItemDto {
  productName: string;
  size: string;
  unitPrice: number;
  quantity: number;
  imageId: string;
}

export interface OrderDto {
  orderId: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  cancellationRequested: boolean;
  items: OrderItemDto[];
}
