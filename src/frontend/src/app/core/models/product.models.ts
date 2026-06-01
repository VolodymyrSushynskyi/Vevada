import { PagedResponse } from './common.models';
import { ProductStatus } from '../constants/product-status';
import { ProductSize } from '../constants/product-size';

export interface ProductSeriesDto {
  id: string;
  name: string;
}

export interface ProductTabCountsDto {
  total: number;
  published: number;
  drafts: number;
}

export interface AdminProductListItemDto {
  id: string;
  name: string;
  mainImageId: string;
  status: ProductStatus;
  lastModified: string;
}

export interface AdminProductListResponse {
  counts: ProductTabCountsDto;
  tableData: PagedResponse<AdminProductListItemDto>;
}

export interface AdminProductDetailsDto {
  id: string;
  productSeriesId: string | null;
  seriesName: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
  price: number;
  status: ProductStatus;
  availableSizes: ProductSize[];
  mainImageId: string;
  galleryImageIds: string[];
}

export interface CreateProductCommand {
  productSeriesId?: string | null;
  newSeriesName?: string | null;
  name: string;
  shortDescription?: string | null;
  fullDescription?: string | null;
  price: number;
  status: ProductStatus;
  availableSizes: ProductSize[];
  mainImageId: string;
  galleryImageIds: string[];
}

export interface UpdateProductCommand extends CreateProductCommand {
  id: string;
}
