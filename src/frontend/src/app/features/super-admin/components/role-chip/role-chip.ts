import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UserRole = 'manufacturer' | 'product-manager' | 'analyst';

@Component({
  selector: 'app-role-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-chip.html',
  styleUrl: './role-chip.css',
})
export class RoleChip {
  @Input({ required: true }) role!: UserRole;

  get labelText(): string {
    const roleNames: Record<UserRole, string> = {
      manufacturer: 'Виробник',
      'product-manager': 'Продукт менеджер',
      analyst: 'Аналітик',
    };
    return roleNames[this.role] || 'Невідома роль';
  }
}
