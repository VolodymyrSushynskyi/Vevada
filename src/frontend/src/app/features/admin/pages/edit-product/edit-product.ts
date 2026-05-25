import { Component } from '@angular/core';
import { UiCard } from '../../components/ui-card/ui-card';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [UiCard],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {}
