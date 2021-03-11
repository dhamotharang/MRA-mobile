import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsTabExplorePage } from './events-tab-explore.page';

const routes: Routes = [
  {
    path: '',
    component: EventsTabExplorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsTabExplorePageRoutingModule {}
