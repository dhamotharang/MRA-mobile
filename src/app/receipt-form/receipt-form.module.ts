import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptFormPageRoutingModule } from './receipt-form-routing.module';

import { ReceiptFormPage } from './receipt-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptFormPageRoutingModule
  ],
  declarations: [ReceiptFormPage]
})
export class ReceiptFormPageModule {}
