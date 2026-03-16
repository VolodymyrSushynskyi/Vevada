import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  imports: [CommonModule],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.css',
})
export class UiButton {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
