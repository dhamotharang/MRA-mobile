import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SosSenderPageRoutingModule } from './sos-sender-routing.module';

import { SosSenderPage } from './sos-sender.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SosSenderPageRoutingModule
  ],
  declarations: [SosSenderPage]
})
export class SosSenderPageModule {}
