import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainButton } from '../../../../shared/components/main-button/main-button';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MainButton],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
