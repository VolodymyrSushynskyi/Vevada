import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-card.html',
  styleUrl: './ui-card.css',
})
export class UiCard {
  @Input() title?: string;
}
