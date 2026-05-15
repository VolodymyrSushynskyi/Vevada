import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconButton } from '../ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-close-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './close-button.html',
  styleUrl: './close-button.css',
})
export class CloseButton {
  @Input() color: 'grey' | 'white' = 'grey';
  @Input() disabled: boolean = false;

  @Output() close = new EventEmitter<void>();
}
