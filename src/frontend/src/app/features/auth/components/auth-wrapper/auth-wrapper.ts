import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { RegisterForm } from '../register-form/register-form';
import { LoginForm } from '../login-form/login-form';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';
import { CloseButton } from '../../../../shared/components/close-button/close-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [CommonModule, SubButton, RegisterForm, LoginForm, BrandLogoWithText, CloseButton],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.css',
})
export class AuthWrapper {
  constructor(private router: Router) {}

  isLoginActive = false;

  toggleMode(): void {
    this.isLoginActive = !this.isLoginActive;
  }

  onClose() {
    window.history.back();
  }
}
