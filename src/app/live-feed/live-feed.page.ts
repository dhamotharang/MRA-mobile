import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';

// import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  private feedList=[];
  data: any;
  navParam: any;
  // private liveFeed= [];
  res: any[];
  feedCategorizedItem = [];


  constructor(
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
    private imageProvider: ImageProvider,
    private loadingProvider: LoadingProvider
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.data)
        this.navParam = this.data
      }
    });
    this.getLiveFeed();
    this.geFeedImg();

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter',this.navParam)
    if (this.navParam) {
      this.getLiveFeed();
      this.geFeedImg();
    }
  }

  getLiveFeed() {
    this.loadingProvider.presentLoading();
    this.restProvider.getProjectFeed(this.navParam.projId).then((result:any) => {
      console.log('getLiveFeed',result);
      this.feedList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      // console.log(err);
      this.loadingProvider.closeLoading();
      // this.loadingProvider.closeLoading();
      // this.showAlert();
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
  
  geFeedImg() {
    this.loadingProvider.presentLoading();
    this.restProvider.geFeedImg().then((result:any) => {
      let p = result.filter(x => x.projectId == this.navParam.projId)
     this.categorizedFeed(p)
      this.loadingProvider.closeLoading();
    }, (err) => {
      // console.log(err);
      this.loadingProvider.closeLoading();
      // this.loadingProvider.closeLoading();
      // this.showAlert();
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
    console.log('feedList',this.feedList);
  }


  
}
