import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectListPageRoutingModule } from './project-list-routing.module';
import { ProjectListPage } from './project-list.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectListPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ProjectListPage]
})
export class ProjectListPageModule {}
