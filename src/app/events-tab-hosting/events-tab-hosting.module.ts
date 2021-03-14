import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsTabHostingPageRoutingModule } from './events-tab-hosting-routing.module';

import { EventsTabHostingPage } from './events-tab-hosting.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsTabHostingPageRoutingModule
  ],
  declarations: [EventsTabHostingPage]
})
export class EventsTabHostingPageModule {}
