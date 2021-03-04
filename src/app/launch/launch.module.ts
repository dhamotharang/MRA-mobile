import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LaunchPage } from './launch.page';

import { LaunchPageRoutingModule } from './launch-routing.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, LaunchPageRoutingModule],
  declarations: [LaunchPage],
})
export class LaunchPageModule {}
