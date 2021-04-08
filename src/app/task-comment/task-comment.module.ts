import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskCommentPageRoutingModule } from './task-comment-routing.module';

import { TaskCommentPage } from './task-comment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskCommentPageRoutingModule
  ],
  declarations: [TaskCommentPage]
})
export class TaskCommentPageModule {}
