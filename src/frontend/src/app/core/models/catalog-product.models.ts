import { ProductSize } from '../constants/product-size';

export interface CatalogProductDto {
  id: string;
  seriesId: string;
  name: string;
  price: number;
  mainImageId: string;
  isFavorite?: boolean;
}

export interface ProductVariationDto {
  id: string;
  mainImageId: string;
}

export interface ProductDetailsDto {
  id: string;
  seriesId: string;
  seriesName: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  price: number;
  availableSizes: ProductSize[];
  mainImageId: string;
  galleryImageIds: string[];
  designVariations: ProductVariationDto[];
}
