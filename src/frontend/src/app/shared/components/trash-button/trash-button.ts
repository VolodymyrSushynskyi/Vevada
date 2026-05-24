import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconButton } from '../ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-trash-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './trash-button.html',
  styleUrl: './trash-button.css',
})
export class TrashButton {
  @Input() disabled: boolean = false;
  @Output() close = new EventEmitter<void>();
}
