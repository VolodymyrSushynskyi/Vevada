import { Routes } from '@angular/router';
import { Home } from './features/client/pages/home/home';
import { ClientAuth } from './features/auth/pages/client-auth/client-auth';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  { path: 'login', component: ClientAuth },
];
