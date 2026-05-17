import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthWrapper } from '../../../auth/components/auth-wrapper/auth-wrapper';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, AuthWrapper],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
