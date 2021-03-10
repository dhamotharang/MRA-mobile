import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VolunteerListPageRoutingModule } from './volunteer-list-routing.module';

import { VolunteerListPage } from './volunteer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VolunteerListPageRoutingModule
  ],
  declarations: [VolunteerListPage]
})
export class VolunteerListPageModule {}
