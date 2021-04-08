import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskCommentPage } from './task-comment.page';

const routes: Routes = [
  {
    path: '',
    component: TaskCommentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskCommentPageRoutingModule {}
