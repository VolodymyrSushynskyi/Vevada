import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [UiIconButton],
  templateUrl: './favorite-button.html',
  styleUrl: './favorite-button.css',
})
export class FavoriteButton {
  @Input() isFavorite: boolean = false;
  @Input() disabled: boolean = false;

  @Output() toggle = new EventEmitter<Event>();
}
