import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-product-manager-layout',
  standalone: true,
  imports: [RouterModule, Sidebar],
  templateUrl: './product-manager-layout.html',
  styleUrl: './product-manager-layout.css',
})
export class ProductManagerLayout {}
