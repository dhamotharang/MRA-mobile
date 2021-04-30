import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrgDetailPage } from './org-detail.page';

const routes: Routes = [
  {
    path: '',
    component: OrgDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrgDetailPageRoutingModule {}
