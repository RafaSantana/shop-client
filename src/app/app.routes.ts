import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/client-product-list/client-product-list').then(
        m => m.ClientProductListComponent,
      ),
  },
  {
    path: 'products-server',
    loadComponent: () =>
      import('./components/server-product-list/server-product-list').then(
        m => m.ServerProductListComponent,
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail').then(m => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent),
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
