import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoles, UserRole } from '../../../../core/constants/roles';

@Component({
  selector: 'app-role-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-chip.html',
  styleUrl: './role-chip.css',
})
export class RoleChip {
  @Input({ required: true }) role!: UserRole | string;

  get labelText(): string {
    const roleNames: Record<string, string> = {
      [AppRoles.Manufacturer]: 'Виробник',
      [AppRoles.ProductManager]: 'Продукт менеджер',
      [AppRoles.Analyst]: 'Аналітик',
      [AppRoles.SuperAdmin]: 'Супер Адмін',
      [AppRoles.Client]: 'Клієнт',
    };
    return roleNames[this.role] || 'Невідома роль';
  }

  get cssClass(): string {
    const classes: Record<string, string> = {
      [AppRoles.Manufacturer]: 'manufacturer',
      [AppRoles.ProductManager]: 'product-manager',
      [AppRoles.Analyst]: 'analyst',
    };
    return classes[this.role] || 'default-role';
  }
}
