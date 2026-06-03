export interface ProfileReviewDto {
  id: string;
  productName: string;
  mainImageUrl: string;
  rating: number;
  text: string;
  createdAt: Date | string;
}
