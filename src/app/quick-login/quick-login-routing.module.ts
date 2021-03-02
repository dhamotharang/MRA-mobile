import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickLoginPage } from './quick-login.page';

const routes: Routes = [
  {
    path: '',
    component: QuickLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickLoginPageRoutingModule {}
