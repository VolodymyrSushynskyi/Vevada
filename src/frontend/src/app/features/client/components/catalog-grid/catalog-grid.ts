import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCard } from '../product-card/product-card';
import { CatalogProductDto } from '../../../../core/models/catalog-product.models';

@Component({
  selector: 'app-catalog-grid',
  standalone: true,
  imports: [CommonModule, ProductCard, MatProgressSpinnerModule],
  templateUrl: './catalog-grid.html',
  styleUrl: './catalog-grid.css',
})
export class CatalogGrid {
  @Input({ required: true }) products: CatalogProductDto[] = [];
  @Input() isLoading: boolean = false;
  @Output() addToCart = new EventEmitter<CatalogProductDto>();
  @Output() toggleFavorite = new EventEmitter<CatalogProductDto>();
}
