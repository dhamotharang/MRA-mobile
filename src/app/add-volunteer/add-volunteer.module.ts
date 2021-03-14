import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVolunteerPageRoutingModule } from './add-volunteer-routing.module';

import { AddVolunteerPage } from './add-volunteer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVolunteerPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddVolunteerPage]
})
export class AddVolunteerPageModule {}
