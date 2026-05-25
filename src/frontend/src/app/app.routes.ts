import { Routes } from '@angular/router';
import { Home } from './features/client/pages/home/home';
import { ClientAuth } from './features/auth/pages/client-auth/client-auth';
import { AdminAuth } from './features/auth/pages/admin-auth/admin-auth';
import { ClientLayout } from './features/client/components/client-layout/client-layout';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';
import { Products } from './features/admin/pages/products/products';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [{ path: 'products', component: Products }],
  },
  { path: 'login', component: ClientAuth },
  {
    path: 'admin/login',
    component: AdminAuth,
  },
];
