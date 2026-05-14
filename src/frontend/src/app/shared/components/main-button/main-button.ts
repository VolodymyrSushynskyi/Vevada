import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButton } from '../ui-button/ui-button';

@Component({
  selector: 'app-main-button',
  standalone: true,
  imports: [UiButton],
  templateUrl: './main-button.html',
  styleUrl: './main-button.css',
})
export class MainButton {
  @Input({ required: true }) label!: string;
  @Input() disabled: boolean = false;

  @Output() btnClick = new EventEmitter<Event>();
}
