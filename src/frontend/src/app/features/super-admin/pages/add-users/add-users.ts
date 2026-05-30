import {
  Component,
  inject,
  OnInit,
  DestroyRef,
  ChangeDetectorRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { AddUserDialog } from '../../components/add-user-dialog/add-user-dialog';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';
import { RoleChip } from '../../components/role-chip/role-chip';

import { AdminAccountsService } from '../../../../core/services/super-admin/admin-accounts.service';
import {
  AdminAccountListItemDto,
  CreateAdminAccountCommand,
} from '../../../../core/models/admin-accounts.models';
import { ToastService } from '../../../../core/services/common/toast.service';
import { TabCountDto } from '../../../../core/models/common.models';

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
    MatPaginatorModule,
    MainButton,
    TrashButton,
    RoleChip,
  ],
  templateUrl: './add-users.html',
  styleUrl: './add-users.css',
})
export class AddUsers implements OnInit {
  private accountsService = inject(AdminAccountsService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private dialog = inject(MatDialog);
  private platformId = inject(PLATFORM_ID);

  displayedColumns: string[] = ['fullName', 'email', 'role', 'actions'];
  readonly roleLabels: Record<string, string> = {
    All: 'Всі',
    Manufacturer: 'Виробники',
    ProductManager: 'Менеджери',
    Analyst: 'Аналітики',
  };
  tabCounts: TabCountDto[] = [
    { key: 'All', count: 0 },
    { key: 'Manufacturer', count: 0 },
    { key: 'ProductManager', count: 0 },
    { key: 'Analyst', count: 0 },
  ];
  dataSource = new MatTableDataSource<AdminAccountListItemDto>([]);

  currentRoleFilter: string = 'all';
  totalCount: number = 0;
  pageSize: number = 6;
  currentPage: number = 1;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(
    role: string = this.currentRoleFilter,
    page: number = this.currentPage,
    pageSize: number = this.pageSize,
  ) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.currentRoleFilter = role;
    this.currentPage = page;
    this.pageSize = pageSize;

    this.accountsService
      .getAccounts(page, pageSize, role)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.tableData.items;
          this.totalCount = response.tableData.totalCount;
          this.tabCounts = response.counts;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.toastService.showError('Помилка при завантаженні списку користувачів');
          console.error(err);
          this.cdr.markForCheck();
        },
      });
  }

  onPageChange(event: PageEvent) {
    const backendPage = event.pageIndex + 1;
    this.loadUsers(this.currentRoleFilter, backendPage, event.pageSize);
  }

  onTabChange(event: any) {
    const selectedTab = this.tabCounts[event.index];

    if (!selectedTab || selectedTab.key === this.currentRoleFilter) return;

    this.currentPage = 1;
    this.loadUsers(selectedTab.key, this.currentPage, this.pageSize);
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialog, {
      maxWidth: '100vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((userData: CreateAdminAccountCommand) => {
      if (userData) {
        this.accountsService
          .createAccount(userData)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Користувача успішно створено');
              this.loadUsers(this.currentRoleFilter);
            },
            error: () => {
              this.toastService.showError('Помилка при створенні користувача');
            },
          });
      }
    });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        title: 'Видалення користувача',
        message: 'Ви впевнені, що хочете видалити цього користувача?',
        confirmText: 'Видалити',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.accountsService
          .deleteAccount(id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.toastService.showSuccess('Користувача видалено');

              if (this.dataSource.data.length === 1 && this.currentPage > 1) {
                this.currentPage--;
              }

              this.loadUsers(this.currentRoleFilter, this.currentPage, this.pageSize);
            },
            error: () => {
              this.toastService.showError('Помилка при видаленні');
            },
          });
      }
    });
  }
}
