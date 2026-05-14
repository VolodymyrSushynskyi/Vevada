import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubButton } from './sub-button';

describe('SubButton', () => {
  let component: SubButton;
  let fixture: ComponentFixture<SubButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
