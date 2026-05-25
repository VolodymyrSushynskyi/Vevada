import { Routes } from '@angular/router';
import { Home } from './features/client/pages/home/home';
import { ClientAuth } from './features/auth/pages/client-auth/client-auth';
import { AdminAuth } from './features/auth/pages/admin-auth/admin-auth';
import { ClientLayout } from './features/client/components/client-layout/client-layout';
import { ProductManagerLayout } from './features/product-manager/components/product-manager-layout/product-manager-layout';
import { Products } from './features/product-manager/pages/products/products';
import { EditProduct } from './features/product-manager/pages/edit-product/edit-product';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [{ path: '', component: Home }],
  },
  {
    path: 'product-manager',
    component: ProductManagerLayout,
    children: [
      { path: 'products', component: Products },
      { path: 'edit', component: EditProduct },
    ],
  },
  { path: 'login', component: ClientAuth },
  {
    path: 'admin/login',
    component: AdminAuth,
  },
];
