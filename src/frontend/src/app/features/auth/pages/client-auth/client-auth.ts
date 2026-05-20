import { Component } from '@angular/core';
import { AuthWrapper } from '../../components/auth-wrapper/auth-wrapper';

@Component({
  selector: 'app-client-auth',
  standalone: true,
  imports: [AuthWrapper],
  templateUrl: './client-auth.html',
  styleUrl: './client-auth.css',
})
export class ClientAuth {}
