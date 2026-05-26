import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
