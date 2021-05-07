import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllFeedPage } from './all-feed.page';

const routes: Routes = [
  {
    path: '',
    component: AllFeedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllFeedPageRoutingModule {}
