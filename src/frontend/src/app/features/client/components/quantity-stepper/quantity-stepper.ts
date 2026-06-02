import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-quantity-stepper',
  standalone: true,
  imports: [MatIconModule, MatRippleModule],
  templateUrl: './quantity-stepper.html',
  styleUrl: './quantity-stepper.css',
})
export class QuantityStepper {
  @Input({ required: true }) quantity!: number;
  @Input() min: number = 1;
  @Input() max: number = 99;

  @Output() quantityChange = new EventEmitter<number>();

  increment(): void {
    if (this.quantity < this.max) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }

  decrement(): void {
    if (this.quantity > this.min) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }
}
