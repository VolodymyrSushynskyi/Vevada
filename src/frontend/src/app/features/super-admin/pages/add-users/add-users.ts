import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { AddUserDialog } from '../../components/add-user-dialog/add-user-dialog';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';
import { RoleChip } from '../../components/role-chip/role-chip';

export type UserRole = 'manufacturer' | 'product-manager' | 'analyst';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

@Component({
  selector: 'app-add-users',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatTabsModule,
    MainButton,
    TrashButton,
    RoleChip,
  ],
  templateUrl: './add-users.html',
  styleUrl: './add-users.css',
})
export class AddUsers implements OnInit {
  private mockUsers: User[] = [
    {
      id: '1',
      firstName: 'Ігор',
      lastName: 'Васильчук',
      email: 'igor@example.com',
      role: 'manufacturer',
    },
    {
      id: '2',
      firstName: 'Олег',
      lastName: 'Васильчук',
      email: 'oleg@example.com',
      role: 'product-manager',
    },
    {
      id: '3',
      firstName: 'Ігор',
      lastName: 'Васильчук',
      email: 'igor2@example.com',
      role: 'manufacturer',
    },
    {
      id: '4',
      firstName: 'Анна',
      lastName: 'Коваль',
      email: 'anna@example.com',
      role: 'product-manager',
    },
    {
      id: '5',
      firstName: 'Іван',
      lastName: 'Васильчук',
      email: 'ivan@example.com',
      role: 'analyst',
    },
  ];

  private dialog = inject(MatDialog);

  displayedColumns: string[] = ['fullName', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  ngOnInit() {
    this.dataSource.data = this.mockUsers;
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialog, {
      maxWidth: '100vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Отримані дані з форми:', result);
      }
    });
  }

  onTabChange(event: any) {
    const roles: (UserRole | 'all')[] = ['all', 'manufacturer', 'product-manager', 'analyst'];
    this.filterByRole(roles[event.index]);
  }

  filterByRole(role: UserRole | 'all') {
    if (role === 'all') {
      this.dataSource.data = this.mockUsers;
    } else {
      this.dataSource.data = this.mockUsers.filter((user) => user.role === role);
    }
  }

  deleteUser(id: string) {
    this.mockUsers = this.mockUsers.filter((user) => user.id !== id);
    this.dataSource.data = this.mockUsers;
  }
}
