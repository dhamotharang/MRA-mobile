import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SosSenderPage } from './sos-sender.page';

const routes: Routes = [
  {
    path: '',
    component: SosSenderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SosSenderPageRoutingModule {}
