import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { UiInput } from '../../../../shared/components/ui-input/ui-input';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, MainButton, UiIconButton, UiInput],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  currentStep = 1;

  nextStep(): void {
    this.currentStep = 2;
  }

  prevStep(): void {
    this.currentStep = 1;
  }
}
