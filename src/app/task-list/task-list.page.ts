import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { ImageProvider } from 'src/providers/image.provider';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  navParam: any;
  private taskList=[];
  fromPage: any;
  role: any;
  taskUpdatedList =[];

  constructor(
    private router: Router,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private route: ActivatedRoute,
    private imageProvider: ImageProvider,
    private cacheHandlerProvider: CacheHandlerProvider,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        this.fromPage = this.router.getCurrentNavigation().extras.state.from;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        console.log('navParam',this.navParam,this.fromPage,this.role)
      }
    });
  }

  ionViewWillEnter() {
    this.getListTasks();
    this.getImgGallery();
  }


  getListTasks() {
    this.restProvider.getTasksList(this.navParam.projId).then((result:any) => {
      console.log('getListTasks',result);
      this.taskList = result;
    }, (err) => {
      console.log(err);
    });
  }

  getImgGallery() {
    this.loadingProvider.presentLoading();
    this.restProvider.getFeedImg().then((result:any) => {
      this.cacheHandlerProvider.galleryImage = result;
      let p = result.filter(x => x.projectId == this.navParam.projId)
      this.categorizedTask(p)
      this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
    });

  }

  categorizedTask(p) {
    let res = [];
    for(let i=0; i < this.taskList.length; i++){
      res = p.filter(x => x.taskId == this.taskList[i].taskId)
      if (res.length != 0) {
        let imgList= []
        imgList = imgList.concat(res)
        this.taskList[i]['taskImg'] = imgList;
      }
      else {
        this.taskList[i]['taskImg'] = null;
      }
    }
    this.taskUpdatedList = this.taskList
    console.log('feedUpdatedList',this.taskList);
  }

  async addImage(data) {
    console.log('addImage',data)
    const actionSheet = await this.actionSheetController.create({
      // header: 'Albums',
      // cssClass: 'my-custom-class',
      buttons: [{
        text: 'Camera',
        role: 'camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
          this.imageProvider.uploadImageCamera(data, 'feed')
        }
      }, {
        text: 'Gallery',
        role: 'gallery',
        icon: 'image',
        handler: () => {
          console.log('Gallery clicked');
          this.imageProvider.uploadImageGallery(data, 'feed')
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  
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
    console.log('navParam',this.navParam,this.fromPage,this.role)
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

  doRefresh(event) {
    this.taskList = []
    this.taskUpdatedList = []
    this.getListTasks();
    this.getImgGallery();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  


}
