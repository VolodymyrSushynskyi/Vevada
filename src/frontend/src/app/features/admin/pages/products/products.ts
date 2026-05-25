import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StatusChip } from '../../components/status-chip/status-chip';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { PencilButton } from '../../components/pencil-button/pencil-button';
import { TrashButton } from '../../../../shared/components/trash-button/trash-button';

export interface Product {
  id: string;
  photoUrl: string;
  name: string;
  status: 'published' | 'draft';
  date: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    photoUrl: '/img/blue-leotard.jpg',
    name: 'Синій комбінезон',
    status: 'published',
    date: '02.09.2025 о 22:30',
  },
  {
    id: '2',
    photoUrl: '/img/blue-leotard.jpg',
    name: 'Синій комбінезон',
    status: 'draft',
    date: '02.09.2025 о 22:30',
  },
  {
    id: '3',
    photoUrl: '/img/blue-leotard.jpg',
    name: 'Синій комбінезон',
    status: 'published',
    date: '02.09.2025 о 22:30',
  },
  {
    id: '4',
    photoUrl: '/img/blue-leotard.jpg',
    name: 'Синій комбінезон',
    status: 'draft',
    date: '02.09.2025 о 22:30',
  },
  {
    id: '5',
    photoUrl: '/img/blue-leotard.jpg',
    name: 'Синій комбінезон',
    status: 'published',
    date: '02.09.2025 о 22:30',
  },
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    StatusChip,
    MainButton,
    PencilButton,
    TrashButton,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  displayedColumns: string[] = ['photo', 'name', 'status', 'date', 'actions'];
  dataSource = MOCK_PRODUCTS;
}
