import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, BrandLogoWithText, SubButton],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {}
