import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CloseButton } from '../../../../shared/components/close-button/close-button';

@Component({
  selector: 'app-size-guide',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, CloseButton],
  templateUrl: './size-guide.html',
  styleUrl: './size-guide.css',
})
export class SizeGuideDialog {
  constructor(public dialogRef: MatDialogRef<SizeGuideDialog>) {}

  close(): void {
    this.dialogRef.close();
  }
}
