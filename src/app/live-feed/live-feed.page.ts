import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { ActionSheetController } from '@ionic/angular';

// import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  private feedList = [];
  private feedUpdatedList = []
  data: any;
  navParam: any;


  constructor(
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private imageProvider: ImageProvider,
    private loadingProvider: LoadingProvider,
    private cacheHandlerProvider: CacheHandlerProvider,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.data)
        this.navParam = this.data
      }
    });

  }

  ionViewWillEnter() {
    if (this.navParam) {
      this.getLiveFeed();
      this.getFeedImg();
    }
  }

  getLiveFeed() {
    this.restProvider.getProjectFeed(this.navParam.projId).then((result:any) => {
      console.log('getLiveFeed',result);
      this.feedList = result;
    }, (err) => {
      console.log(err);
    });
  }


  navNextPage() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.navParam
      }
    };
    this.router.navigate(['create-post'], navigationExtras);
  }
  
  getFeedImg() {
    this.loadingProvider.presentLoading();
    this.restProvider.getFeedImg().then((result:any) => {
      this.cacheHandlerProvider.galleryImage = result;
      let p = result.filter(x => x.projectId == this.navParam.projId)
      this.categorizedFeed(p)
      this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
    });

  }

  categorizedFeed(p) {
    let res = [];
    for(let i=0; i < this.feedList.length; i++){
      res = p.filter(x => x.feedId == this.feedList[i].feedId)
      if (res.length != 0) {
        let imgList= []
        imgList = imgList.concat(res)
        this.feedList[i]['feedImg'] = imgList;
      }
      else {
        this.feedList[i]['feedImg'] = null;
      }
    }
    this.feedUpdatedList = this.feedList
    console.log('feedUpdatedList',this.feedList);
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

  doRefresh(event) {
    this.feedList = []
    this.feedUpdatedList = []
    this.getLiveFeed();
    this.getFeedImg();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }


  
}
