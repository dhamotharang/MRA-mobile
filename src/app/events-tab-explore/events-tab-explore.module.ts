import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventsTabExplorePageRoutingModule } from './events-tab-explore-routing.module';

import { EventsTabExplorePage } from './events-tab-explore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventsTabExplorePageRoutingModule
  ],
  declarations: [EventsTabExplorePage]
})
export class EventsTabExplorePageModule {}
