import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-horizontal-product-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './horizontal-product-card.html',
  styleUrl: './horizontal-product-card.css',
})
export class HorizontalProductCard {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) price!: number;
  @Input({ required: true }) imageUrl!: string;
  @Input() productId?: string;
}
