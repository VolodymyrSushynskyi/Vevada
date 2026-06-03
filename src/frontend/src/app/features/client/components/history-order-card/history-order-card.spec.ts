import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryOrderCard } from './history-order-card';

describe('HistoryOrderCard', () => {
  let component: HistoryOrderCard;
  let fixture: ComponentFixture<HistoryOrderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryOrderCard],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryOrderCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
