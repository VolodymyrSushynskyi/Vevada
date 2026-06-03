import { Routes } from '@angular/router';
import { Home } from './features/client/pages/home/home';
import { ProductDetails } from './features/client/pages/product-details/product-details';
import { Cart } from './features/client/pages/cart/cart';
import { Favorites } from './features/client/pages/favorites/favorites';
import { Orders } from './features/client/pages/orders/orders';
import { History } from './features/client/pages/history/history';
import { Reviews } from './features/client/pages/reviews/reviews';
import { ClientAuth } from './features/auth/pages/client-auth/client-auth';
import { AdminAuth } from './features/auth/pages/admin-auth/admin-auth';
import { ClientLayout } from './features/client/components/client-layout/client-layout';
import { ProductManagerLayout } from './features/product-manager/components/product-manager-layout/product-manager-layout';
import { SuperAdminLayout } from './features/super-admin/components/super-admin-layout/super-admin-layout';
import { Products } from './features/product-manager/pages/products/products';
import { EditProduct } from './features/product-manager/pages/edit-product/edit-product';
import { AddProduct } from './features/product-manager/pages/add-product/add-product';
import { AddUsers } from './features/super-admin/pages/add-users/add-users';
import { ProfileLayuot } from './features/client/components/profile-layuot/profile-layuot';

export const routes: Routes = [
  {
    path: '',
    component: ClientLayout,
    children: [
      { path: '', component: Home },
      { path: 'product/:id', component: ProductDetails },
      { path: 'cart', component: Cart },
      { path: 'favorites', component: Favorites },
      {
        path: 'profile',
        component: ProfileLayuot,
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          { path: 'orders', component: Orders },
          { path: 'history', component: History },
          { path: 'reviews', component: Reviews },
        ],
      },
    ],
  },
  {
    path: 'product-manager',
    component: ProductManagerLayout,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: Products },
      { path: 'edit-products/:id', component: EditProduct },
      { path: 'add-products', component: AddProduct },
    ],
  },
  {
    path: 'super-admin',
    component: SuperAdminLayout,
    children: [
      { path: '', redirectTo: 'add-users', pathMatch: 'full' },
      { path: 'add-users', component: AddUsers },
    ],
  },
  { path: 'login', component: ClientAuth },
  {
    path: 'admin/login',
    component: AdminAuth,
  },
];
