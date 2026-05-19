import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, MainButton, UiInput],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {}
