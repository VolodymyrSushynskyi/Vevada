export interface CartItemDto {
  cartItemId: number;
  productId: string;
  productName: string;
  size: string | number;
  unitPrice: number;
  quantity: number;
  imageId: string;
  isAvailable: boolean;
}

export interface CartDto {
  cartId: number;
  items: CartItemDto[];
  totalAmount: number;
}
