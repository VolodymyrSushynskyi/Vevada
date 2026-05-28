export enum ProductStatus {
  Draft = 0,
  Published = 1,
}

export enum ProductSize {
  Size98 = 98,
  Size110 = 110,
  Size116 = 116,
  Size122 = 122,
  Size128 = 128,
  Size134 = 134,
  Size140 = 140,
  Size146 = 146,
  Size152 = 152,
  Size160 = 160,
  Size168 = 168,
}

export interface ProductTabCountsDto {
  all: number;
  published: number;
  draft: number;
}

export interface PagedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface AdminProductListItemDto {
  id: string;
  name: string;
  photoUrl: string;
  status: ProductStatus;
  date: string;
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
