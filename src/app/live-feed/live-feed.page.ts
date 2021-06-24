import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';

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
    private cacheHandlerProvider: CacheHandlerProvider
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
    if (this.cacheHandlerProvider.galleryImage.length == 0) {
      console.log('getFeedImg',this.cacheHandlerProvider.galleryImage)
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
    else {
      let p = this.cacheHandlerProvider.galleryImage.filter(x => x.projectId == this.navParam.projId)
      this.categorizedFeed(p)
    }

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
