import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HorizontalList } from '../../../../shared/components/horizontal-list/horizontal-list';
import { UiIconButton } from '../../../../shared/components/ui-icon-button/ui-icon-button';
import { BrandLogoWithText } from '../../../../shared/components/brand-logo-with-text/brand-logo-with-text';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, HorizontalList, BrandLogoWithText, UiIconButton],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
