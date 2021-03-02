import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuickLoginPageRoutingModule } from './quick-login-routing.module';

import { QuickLoginPage } from './quick-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuickLoginPageRoutingModule,
  ],
  declarations: [QuickLoginPage],
})
export class QuickLoginPageModule {}
