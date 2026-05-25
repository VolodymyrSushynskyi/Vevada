import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-pencil-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './pencil-button.html',
  styleUrl: './pencil-button.css',
})
export class PencilButton {
  @Input() disabled: boolean = false;
  @Output() edit = new EventEmitter<void>();
}
