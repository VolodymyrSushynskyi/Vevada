import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brand-logo-with-text',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './brand-logo-with-text.html',
  styleUrl: './brand-logo-with-text.css',
})
export class BrandLogoWithText {
  @Input() textSize: string = '64px';
  @Input() iconSize: string = '60px';
}
