import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { RegisterForm } from '../register-form/register-form';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [CommonModule, SubButton, RegisterForm, LoginForm],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.css',
})
export class AuthWrapper {
  isLoginActive = false;

  toggleMode(): void {
    this.isLoginActive = !this.isLoginActive;
  }
}
