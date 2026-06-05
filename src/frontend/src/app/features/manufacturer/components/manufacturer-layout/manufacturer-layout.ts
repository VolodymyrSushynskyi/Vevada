import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-manufacturer-layout',
  imports: [RouterModule, Sidebar],
  templateUrl: './manufacturer-layout.html',
  styleUrl: './manufacturer-layout.css',
})
export class ManufacturerLayout {}
