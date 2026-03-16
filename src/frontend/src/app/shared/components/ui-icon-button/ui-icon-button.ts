import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-icon-button',
  imports: [CommonModule],
  templateUrl: './ui-icon-button.html',
  styleUrl: './ui-icon-button.css',
})
export class UiIconButton {
  @Input() disabled: boolean = false;
  @Input() size: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' = 'small';
  @Input() color: 'grey' | 'white' | 'light-grey' = 'grey';
  
  @Input() isToggle: boolean = false;
  @Input() toggled: boolean = false;
  
  @Output() toggledChange = new EventEmitter<boolean>();

  handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    
    if (this.isToggle) {
      this.toggled = !this.toggled;
      this.toggledChange.emit(this.toggled);
    }
  }
}
