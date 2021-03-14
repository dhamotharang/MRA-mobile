import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsTabbarPageRoutingModule } from './events-tabbar-routing.module';

import { EventsTabbarPage } from './events-tabbar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsTabbarPageRoutingModule
  ],
  declarations: [EventsTabbarPage]
})
export class EventsTabbarPageModule {}
