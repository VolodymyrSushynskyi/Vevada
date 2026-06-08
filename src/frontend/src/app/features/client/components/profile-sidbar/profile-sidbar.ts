import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';

@Component({
  selector: 'app-profile-sidbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SubButton],
  templateUrl: './profile-sidbar.html',
  styleUrl: './profile-sidbar.css',
})
export class ProfileSidbar {
  user = {
    name: 'Hanna Oleksiienko',
    email: 'hanna_oleksiienko@gmail.com',
  };

  onLogout() {
    console.log('Вихід з акаунту');
  }
}
