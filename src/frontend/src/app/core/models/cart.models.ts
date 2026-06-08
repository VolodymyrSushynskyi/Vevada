export interface AddCartItemDto {
  productId: string;
  size: string;
  quantity: number;
}

export interface CartItemDto {
  cartItemId: number;
  productId: string;
  productName: string;
  size: string;
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
