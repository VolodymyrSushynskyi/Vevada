import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VALIDATION_MESSAGES } from '../../../core/constants/validation-messages';

@Component({
  selector: 'app-ui-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './ui-input.html',
  styleUrl: './ui-input.css',
  providers: [],
})
export class UiInput {
  @Input({ required: true }) label!: string;
  @Input() type: 'text' | 'password' | 'email' | 'tel' = 'text';
  @Input() control: FormControl = new FormControl();

  isPasswordVisible: boolean = false;

  private readonly errorMessages = VALIDATION_MESSAGES;

  get errorMessage(): string | null {
    if (!this.control || !this.control.errors) return null;

    const firstErrorKey = Object.keys(this.control.errors)[0];
    const getMessage = this.errorMessages[firstErrorKey];

    return getMessage ? getMessage(this.control.errors[firstErrorKey]) : 'Невірне значення';
  }

  togglePasswordVisibility(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
