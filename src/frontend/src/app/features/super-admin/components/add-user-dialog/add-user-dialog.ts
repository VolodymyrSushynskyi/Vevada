import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MainButton } from '../../../../shared/components/main-button/main-button';
import { CloseButton } from '../../../../shared/components/close-button/close-button';
import { RegisterClientRules } from '../../../../core/validators/client/register-client';
import { passwordMatchValidator } from '../../../../core/validators/client/password-match';
import { ToastService } from '../../../../core/services/common/toast.service';
import {
  VALIDATION_MESSAGES,
  VALIDATION_PRIORITY,
} from '../../../../core/constants/validation-messages';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MainButton,
    CloseButton,
  ],
  templateUrl: './add-user-dialog.html',
  styleUrl: './add-user-dialog.css',
})
export class AddUserDialog {
  private dialogRef = inject(MatDialogRef<AddUserDialog>);
  private toastService = inject(ToastService);

  hidePassword = true;
  hideConfirmPassword = true;

  userForm = new FormGroup(
    {
      firstName: new FormControl('', RegisterClientRules.firstName),
      lastName: new FormControl('', RegisterClientRules.lastName),
      email: new FormControl('', RegisterClientRules.email),
      password: new FormControl('', RegisterClientRules.password),
      confirmPassword: new FormControl('', RegisterClientRules.password),
      role: new FormControl('analyst', [Validators.required]),
    },
    { validators: passwordMatchValidator },
  );

  private readonly errorMessages = VALIDATION_MESSAGES;
  private readonly priorityOrder = VALIDATION_PRIORITY;

  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName);
    if (!control || !control.errors) return '';

    const firstErrorKey = this.priorityOrder.find((key) => control.errors![key]);
    const activeErrorKey = firstErrorKey || Object.keys(control.errors)[0];
    const getMessage = this.errorMessages[activeErrorKey];
    return getMessage ? getMessage(control.errors[activeErrorKey]) : 'Невірне значення';
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = {
        firstName: this.userForm.value.firstName!,
        lastName: this.userForm.value.lastName!,
        email: this.userForm.value.email!,
        password: this.userForm.value.password!,
        role: this.userForm.value.role!,
      };
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
