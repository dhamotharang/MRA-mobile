import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  private taskList = [
    {task_title: 'New Order has been placed',profile_image: 'assets/covid-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {task_title: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {task_title: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
