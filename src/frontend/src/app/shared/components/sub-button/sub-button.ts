import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'app-sub-button',
  standalone: true,
  imports: [UiButton],
  templateUrl: './sub-button.html',
  styleUrl: './sub-button.css',
})
export class SubButton {
  @Input({ required: true }) label!: string;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() disabled: boolean = false;

  @Output() btnClick = new EventEmitter<Event>();
}
