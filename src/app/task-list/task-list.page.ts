import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  navParam: any;
  private taskList = [
    {task_title: 'New Order has been placed',profile_image: 'assets/covid-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {task_title: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'},
    {task_title: 'New Order has been placed',profile_image: 'assets/gaza-img.jpg', task_image: [ {task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'},{task_images:'assets/covid-img.jpg'}],description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.'}
  ]

  constructor(
    private router: Router,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider
  ) { }

  ngOnInit() {
    this.getListTasks();
  }

  navNextPage(data) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }


  getListTasks() {
    this.loadingProvider.presentLoading();
    this.restProvider.getTasksList(320).then((result:any) => {
      console.log('getListTasks',result);
      this.taskList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }


}
