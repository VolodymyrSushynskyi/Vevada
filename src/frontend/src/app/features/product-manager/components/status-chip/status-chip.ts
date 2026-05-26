import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProductStatus = 'draft' | 'published';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-chip.html',
  styleUrl: './status-chip.css',
})
export class StatusChip {
  @Input({ required: true }) status!: ProductStatus;

  get labelText(): string {
    return this.status === 'published' ? 'Опубліковано' : 'Чернетка';
  }
}
