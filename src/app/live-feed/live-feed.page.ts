import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  private feedList=[];
  data: any;
  navParam: any;
  private liveFeed= [];


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
    this.getLiveFeeds();

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter',this.navParam)
    if (this.navParam) {
      this.getLiveFeed();
      this.getLiveFeeds();
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
  
  getLiveFeeds() {
    this.loadingProvider.presentLoading();
    this.restProvider.getLiveFeed().then((result:any) => {
      console.log('getLiveFeed',result);
      this.liveFeed = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      // console.log(err);
      this.loadingProvider.closeLoading();
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

}
