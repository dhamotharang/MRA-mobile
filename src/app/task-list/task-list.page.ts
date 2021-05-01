import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { ImageProvider } from 'src/providers/image.provider';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  navParam: any;
  private taskList=[];
  fromPage: any;

  constructor(
    private router: Router,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private route: ActivatedRoute,
    private imageProvider: ImageProvider,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from;
        console.log('navParam',this.navParam,this.fromPage)
      }
    });
  }

  ionViewWillEnter() {
    this.getListTasks();
  }


  getListTasks() {
    this.loadingProvider.presentLoading();
    this.restProvider.getTasksList(this.navParam.projId).then((result:any) => {
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

  navNextPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user:this.navParam,
        from:this.fromPage
      }
    };
    this.router.navigate(['create-post'], navigationExtras);
  }

  addParticipant(data) {
    console.log('addParticipant',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user:this.navParam,
        from:this.fromPage,
        data: data
      }
    };
    this.router.navigate(['add-volunteer'], navigationExtras);
  }

  commentTask(data) {
    let navigationExtras: NavigationExtras = {
      state: {
        user:this.navParam,
        from:'commentTask',
        data:data
      }
    };
    this.router.navigate(['task-comment'], navigationExtras);
  }

  


}
