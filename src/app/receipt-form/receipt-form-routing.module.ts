import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptFormPage } from './receipt-form.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiptFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptFormPageRoutingModule {}
