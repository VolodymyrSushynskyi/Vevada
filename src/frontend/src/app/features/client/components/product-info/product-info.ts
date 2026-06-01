import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductDetailsDto } from '../../../../core/models/catalog-product.models';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { FavoriteButton } from '../favorite-button/favorite-button';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';
import { HorizontalList } from '../../../../shared/components/horizontal-list/horizontal-list';

import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MainButton,
    FavoriteButton,
    MatIconModule,
    ImageUrlPipe,
    HorizontalList,
  ],
  templateUrl: './product-info.html',
  styleUrl: './product-info.css',
})
export class ProductInfo {
  @Input({ required: true }) product!: ProductDetailsDto;
  @Input() isFavorite: boolean = false;

  @Output() addToCart = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() openSizeGuide = new EventEmitter<void>();

  isDescriptionExpanded: boolean = false;

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
}
