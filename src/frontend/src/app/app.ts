import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconRegistration } from './core/services/common/icon-registration';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  constructor(private iconService: IconRegistration) {
    this.iconService.registerIcons();
  }
}
