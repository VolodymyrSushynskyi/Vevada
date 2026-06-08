import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { MainButton } from '../../../../shared/components/main-button/main-button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { OrderDetails } from '../../../client/components/order-details/order-details';

@Component({
  selector: 'app-manufacturer-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    SubButton,
    MainButton,
    MatDialogModule,
  ],
  templateUrl: './manufacturer-orders.html',
  styleUrl: './manufacturer-orders.css',
})
export class ManufacturerOrders implements OnInit {
  private allMockOrders: OrderSummaryDto[] = [
    {
      id: 'guid-1',
      orderNumber: '10128',
      createdAt: new Date('2026-05-28T10:00:00'),
      totalAmount: 9139,
      itemsCount: 4,
      mainImageUrl: '/img/pink-leotard1.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Ваше замовлення чекає підтвердження',
    },
    {
      id: 'guid-mock-5',
      orderNumber: '10127',
      createdAt: new Date('2026-04-24T09:50:00').toISOString(),
      totalAmount: 1800,
      itemsCount: 1,
      mainImageUrl: '/img/purple-rhinestone-leo.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
    {
      id: 'guid-mock-4',
      orderNumber: '10126',
      createdAt: new Date('2026-04-19T08:20:00').toISOString(),
      totalAmount: 4100,
      itemsCount: 2,
      mainImageUrl: '/img/emerald-dream-leotard.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
    {
      id: 'guid-mock-3',
      orderNumber: '10125',
      createdAt: new Date('2026-04-17T16:45:00').toISOString(),
      totalAmount: 8900,
      itemsCount: 4,
      mainImageUrl: '/img/training-kit-basics.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
    {
      id: 'guid-mock-2',
      orderNumber: '10124',
      createdAt: new Date('2026-04-11T11:05:00').toISOString(),
      totalAmount: 3200,
      itemsCount: 1,
      mainImageUrl: '/img/firebird-leotard.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
    {
      id: 'guid-mock-1',
      orderNumber: '10123',
      createdAt: new Date('2026-04-11T14:30:00').toISOString(),
      totalAmount: 5400,
      itemsCount: 2,
      mainImageUrl: '/img/blue-ocean-leotard.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
    {
      id: 'guid-mock-0',
      orderNumber: '10122',
      createdAt: new Date('2026-04-09T09:15:00').toISOString(),
      totalAmount: 2500,
      itemsCount: 1,
      mainImageUrl: '/img/black-swan-leotard.jpg',
      status: OrderStatus.Pending,
      statusMessage: 'Очікує на обробку',
    },
  ];
  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  ) {}

  public displayedOrders: OrderSummaryDto[] = [];
  public totalRecords = this.allMockOrders.length;
  public pageSize = 6;

  public displayedColumns: string[] = ['orderNumber', 'itemsCount', 'createdAt', 'actions'];

  ngOnInit(): void {
    this.loadPage(0);
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadPage(event.pageIndex);
  }

  private loadPage(pageIndex: number): void {
    const startIndex = pageIndex * this.pageSize;
    this.displayedOrders = this.allMockOrders.slice(startIndex, startIndex + this.pageSize);
    this.cdr.markForCheck();
  }

  public viewDetails(order: OrderSummaryDto): void {
    const mockOrderItems = [
      {
        id: 'item-1',
        productName: 'Костюм зі смужками з боку',
        mainImageUrl:
          'https://api.vevada.uk/content/images/358b8141-66af-42ba-aaf5-2d4270cd0feb-thumb.webp',
        price: 3020,
        sizeLabel: '160',
        quantity: 2,
      },
      {
        id: 'item-2',
        productName: 'Костюм з діагональними смужками',
        mainImageUrl:
          'https://api.vevada.uk/content/images/07208ac1-0e48-4de0-ab3e-1edd2a683f3a-thumb.webp',
        price: 1099,
        sizeLabel: '152',
        quantity: 1,
      },
      {
        id: 'item-3',
        productName: 'Костюм з горизонтальними смужками',
        mainImageUrl:
          'https://api.vevada.uk/content/images/b405ee3a-6e5e-43d5-8f0c-cff481a2f0e8-thumb.webp',
        price: 2000,
        sizeLabel: '134',
        quantity: 1,
      },
    ];

    this.dialog.open(OrderDetails, {
      width: '600px',
      maxWidth: '90vw',
      autoFocus: false,
      data: {
        orderNumber: order.orderNumber.replace('№', ''),
        items: mockOrderItems,
      },
    });
  }

  public takeInWork(order: OrderSummaryDto): void {
    console.log('Взяти в роботу замовлення:', order.orderNumber);
  }
}
