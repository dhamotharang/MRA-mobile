import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'launch',
    loadChildren: () =>
      import('./launch/launch.module').then((m) => m.LaunchPageModule),
  },
  {
    path: '',
    redirectTo: 'launch',
    pathMatch: 'full',
  },
  {
    path: 'quick-login',
    loadChildren: () =>
      import('./quick-login/quick-login.module').then(
        (m) => m.QuickLoginPageModule
      ),
  },
  {
    path: 'payment-history',
    loadChildren: () =>
      import('./payment-history/payment-history.module').then(
        (m) => m.PaymentHistoryPageModule
      ),
  },
  {
    path: 'home-tab',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
