import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsTabHostingPage } from './events-tab-hosting.page';

const routes: Routes = [
  {
    path: '',
    component: EventsTabHostingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsTabHostingPageRoutingModule {}
