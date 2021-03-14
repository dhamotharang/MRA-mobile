import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVolunteerPage } from './add-volunteer.page';

const routes: Routes = [
  {
    path: '',
    component: AddVolunteerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVolunteerPageRoutingModule {}
