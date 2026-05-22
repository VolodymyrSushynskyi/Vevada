import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalList } from './horizontal-list';

describe('HorizontalList', () => {
  let component: HorizontalList;
  let fixture: ComponentFixture<HorizontalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalList],
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
