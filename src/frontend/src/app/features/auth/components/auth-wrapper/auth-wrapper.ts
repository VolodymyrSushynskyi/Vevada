import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [CommonModule, SubButton],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.css',
})
export class AuthWrapper {
  isLoginActive = false;

  toggleMode(): void {
    this.isLoginActive = !this.isLoginActive;
  }
}
