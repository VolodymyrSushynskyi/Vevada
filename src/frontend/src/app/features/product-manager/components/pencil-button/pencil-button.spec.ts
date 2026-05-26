import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilButton } from './pencil-button';

describe('PencilButton', () => {
  let component: PencilButton;
  let fixture: ComponentFixture<PencilButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PencilButton],
    }).compileComponents();

    fixture = TestBed.createComponent(PencilButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
