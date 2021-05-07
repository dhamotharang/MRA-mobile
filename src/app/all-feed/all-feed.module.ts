import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllFeedPageRoutingModule } from './all-feed-routing.module';

import { AllFeedPage } from './all-feed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllFeedPageRoutingModule
  ],
  declarations: [AllFeedPage]
})
export class AllFeedPageModule {}
