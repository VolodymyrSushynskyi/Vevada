import { Routes } from '@angular/router';
import { Home } from './features/client/pages/home/home';
import { ClientAuth } from './features/auth/pages/client-auth/client-auth';
import { AdminAuth } from './features/auth/pages/admin-auth/admin-auth';
import { ClientLayout } from './features/client/components/client-layout/client-layout';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [{ path: '', component: Home }],
  },
  { path: 'login', component: ClientAuth },
  {
    path: 'admin/login',
    component: AdminAuth,
  },
];
