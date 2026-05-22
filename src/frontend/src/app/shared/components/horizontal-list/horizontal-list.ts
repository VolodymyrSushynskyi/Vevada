import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

type FlexJustify =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

@Component({
  selector: 'app-horizontal-list',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './horizontal-list.html',
  styleUrl: './horizontal-list.css',
})
export class HorizontalList {
  @Input() public gap: string = '16px';
  @Input() public justify: FlexJustify = 'flex-start';
  @Input() public align: FlexAlign = 'center';
}
