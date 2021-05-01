import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrgDetailPageRoutingModule } from './org-detail-routing.module';

import { OrgDetailPage } from './org-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrgDetailPageRoutingModule
  ],
  declarations: [OrgDetailPage]
})
export class OrgDetailPageModule {}
