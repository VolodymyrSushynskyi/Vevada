import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Импорты моделей и компонентов
import { OrderSummaryDto } from '../../../../core/models/order.models';
import { OrderStatus } from '../../../../core/constants/order-status';
import { OrderStatusChip } from '../../../client/components/order-status-chip/order-status-chip';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';
import { OrderDetails } from '../../../client/components/order-details/order-details';

@Component({
  selector: 'app-manufacturer-history-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    OrderStatusChip,
    SubButton,
  ],
  templateUrl: './manufacturer-history-page.html',
  styleUrl: './manufacturer-history-page.css',
})
export class ManufacturerHistoryPage implements OnInit {
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);

  private allMockHistory: OrderSummaryDto[] = [
    {
      id: 'hist-1',
      orderNumber: '10128',
      createdAt: new Date('2026-05-28T10:00:00').toISOString(),
      totalAmount: 4500,
      itemsCount: 3,
      mainImageUrl: '',
      status: OrderStatus.Completed,
      statusMessage: '',
    },
    {
      id: 'hist-2',
      orderNumber: '1095',
      createdAt: new Date('2026-05-01T14:15:00').toISOString(),
      totalAmount: 1200,
      itemsCount: 1,
      mainImageUrl: '',
      status: OrderStatus.Cancelled,
      statusMessage: '',
    },
    {
      id: 'hist-3',
      orderNumber: '1094',
      createdAt: new Date('2026-04-30T09:45:00').toISOString(),
      totalAmount: 8900,
      itemsCount: 5,
      mainImageUrl: '',
      status: OrderStatus.Completed,
      statusMessage: '',
    },
    {
      id: 'hist-4',
      orderNumber: '1093',
      createdAt: new Date('2026-05-29T18:20:00').toISOString(),
      totalAmount: 3200,
      itemsCount: 2,
      mainImageUrl: '',
      status: OrderStatus.Completed,
      statusMessage: '',
    },
    {
      id: 'hist-5',
      orderNumber: '1092',
      createdAt: new Date('2026-05-28T11:10:00').toISOString(),
      totalAmount: 1500,
      itemsCount: 1,
      mainImageUrl: '',
      status: OrderStatus.Cancelled,
      statusMessage: '',
    },
    {
      id: 'hist-6',
      orderNumber: '1091',
      createdAt: new Date('2026-05-27T16:30:00').toISOString(),
      totalAmount: 5400,
      itemsCount: 3,
      mainImageUrl: '',
      status: OrderStatus.Completed,
      statusMessage: '',
    },
    {
      id: 'hist-7',
      orderNumber: '1090',
      createdAt: new Date('2026-05-26T10:05:00').toISOString(),
      totalAmount: 2100,
      itemsCount: 1,
      mainImageUrl: '',
      status: OrderStatus.Completed,
      statusMessage: '',
    },
  ];

  public displayedOrders: OrderSummaryDto[] = [];
  public totalRecords = this.allMockHistory.length;
  public pageSize = 6;
  public displayedColumns: string[] = [
    'orderNumber',
    'itemsCount',
    'createdAt',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.loadPage(0);
  }

  public onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadPage(event.pageIndex);
  }

  private loadPage(pageIndex: number): void {
    const startIndex = pageIndex * this.pageSize;
    this.displayedOrders = this.allMockHistory.slice(startIndex, startIndex + this.pageSize);
    this.cdr.markForCheck();
  }

  public viewDetails(orderNumber: string): void {
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
      autoFocus: false,
      data: { orderNumber, items: mockOrderItems },
    });
  }
}
