import { Component } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ProductForm],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {}
