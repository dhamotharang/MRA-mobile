import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordPaymentPage } from './record-payment.page';

const routes: Routes = [
  {
    path: '',
    component: RecordPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordPaymentPageRoutingModule {}
