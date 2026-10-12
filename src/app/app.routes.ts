import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes) },
  { path: '', redirectTo: 'tabs/tab1', pathMatch: 'full' },
  { path: '**', redirectTo: 'tabs/tab1' },
];
