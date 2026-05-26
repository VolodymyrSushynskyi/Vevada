import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconButton } from '../ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  @Input() color: 'grey' | 'white' = 'grey';
  @Input() disabled: boolean = false;

  @Output() back = new EventEmitter<void>();
}
