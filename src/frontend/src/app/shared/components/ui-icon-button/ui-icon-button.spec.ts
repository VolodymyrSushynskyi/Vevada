import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiIconButton } from './ui-icon-button';

describe('UiIconButton', () => {
  let component: UiIconButton;
  let fixture: ComponentFixture<UiIconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIconButton],
    }).compileComponents();

    fixture = TestBed.createComponent(UiIconButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
