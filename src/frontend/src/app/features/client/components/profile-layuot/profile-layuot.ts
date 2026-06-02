import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileSidbar } from '../profile-sidbar/profile-sidbar';

@Component({
  selector: 'app-profile-layuot',
  standalone: true,
  imports: [RouterModule, ProfileSidbar],
  templateUrl: './profile-layuot.html',
  styleUrl: './profile-layuot.css',
})
export class ProfileLayuot {}
