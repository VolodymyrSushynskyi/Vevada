import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [RouterModule, Sidebar],
  templateUrl: './super-admin-layout.html',
  styleUrl: './super-admin-layout.css',
})
export class SuperAdminLayout {}
