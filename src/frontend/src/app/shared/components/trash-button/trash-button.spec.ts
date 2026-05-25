import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashButton } from './trash-button';

describe('TrashButton', () => {
  let component: TrashButton;
  let fixture: ComponentFixture<TrashButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrashButton],
    }).compileComponents();

    fixture = TestBed.createComponent(TrashButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
