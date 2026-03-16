import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiButton } from '../../../../shared/components/ui-button/ui-button';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, UiButton, UiIconButton, UiInput],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  isPasswordVisible = false;
}
