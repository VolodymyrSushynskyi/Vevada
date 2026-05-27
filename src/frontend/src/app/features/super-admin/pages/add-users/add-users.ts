import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialog } from '../../components/add-user-dialog/add-user-dialog';
import { MainButton } from '../../../../shared/components/main-button/main-button';

@Component({
  selector: 'app-add-users',
  imports: [CommonModule, MainButton],
  templateUrl: './add-users.html',
  styleUrl: './add-users.css',
})
export class AddUsers {
  private dialog = inject(MatDialog);

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
}
