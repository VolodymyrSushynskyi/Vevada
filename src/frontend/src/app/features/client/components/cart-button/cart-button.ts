import { Component, EventEmitter, Output, Input } from '@angular/core';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.css',
})
export class CartButton {
  @Input() disabled: boolean = false;

  @Output() addToCart = new EventEmitter<Event>();
}
