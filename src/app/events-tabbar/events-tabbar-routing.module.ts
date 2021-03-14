import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsTabbarPage } from './events-tabbar.page';

const routes: Routes = [
  {
    path: '',
    component: EventsTabbarPage,
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../events-tab-explore/events-tab-explore.module').then(
                (m) => m.EventsTabExplorePageModule
              ),
          },
        ],
      },
      {
        path: 'hosting',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../events-tab-hosting/events-tab-hosting.module').then(
                (m) => m.EventsTabHostingPageModule
              ),
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsTabbarPageRoutingModule {}
