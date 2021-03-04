import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'quick-login',
    loadChildren: () => import('./quick-login/quick-login.module').then( m => m.QuickLoginPageModule)
  },  {
    path: 'project-list',
    loadChildren: () => import('./project-list/project-list.module').then( m => m.ProjectListPageModule)
  },
  {
    path: 'project-detail',
    loadChildren: () => import('./project-detail/project-detail.module').then( m => m.ProjectDetailPageModule)
  },
  {
    path: 'live-feed',
    loadChildren: () => import('./live-feed/live-feed.module').then( m => m.LiveFeedPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
