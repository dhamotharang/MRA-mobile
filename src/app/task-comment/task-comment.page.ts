import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { ImageProvider } from 'src/providers/image.provider';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.page.html',
  styleUrls: ['./task-comment.page.scss'],
})
export class TaskCommentPage implements OnInit {
  navParam: any;
  fromPage: any;
  taskCommentList=[];
  taskDetail: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private imageProvider: ImageProvider,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from;
        this.taskDetail = this.router.getCurrentNavigation().extras.state.data;
        console.log('navParam',this.navParam,this.fromPage)
      }
    });
  }

  ionViewWillEnter() {
    this.getCommentList()
  }

  getCommentList() {
    this.loadingProvider.presentLoading();
    this.restProvider.getTasksCommentList(this.taskDetail.taskId).then((result:any) => {
      console.log('getCommentList',result);
      this.taskCommentList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }



  commentTask() {
    let navigationExtras: NavigationExtras = {
      state: {
        user:this.navParam,
        from:'commentTask',
        data:this.taskDetail
      }
    };
    this.router.navigate(['create-post'], navigationExtras);
  }

  doRefresh(event) {
    this.taskCommentList = []
    this.getCommentList()
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}




