export interface ProductReviewDto {
  id: number;
  userId: number;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface LeaveReviewDto {
  rating: number;
  comment?: string;
}
