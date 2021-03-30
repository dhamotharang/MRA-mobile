import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.page.html',
  styleUrls: ['./live-feed.page.scss'],
})
export class LiveFeedPage implements OnInit {
  private feedList;
  data: any;
  navParam: any;

  constructor(
    private restProvider: RestProvider,
    private router: Router,
    private route: ActivatedRoute,
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
  }

  getLiveFeed() {
    this.restProvider.getProjectFeed(this.navParam.projId).then((result:any) => {
      console.log('getLiveFeed',result);
      this.feedList = result;
      // this.donateList = result;
      // to make sure UI view is updatinig
      // this.zone.run(() => {
      // for(let i=0; i<result.length; i++){
      //   this.isDonateShown.push(false);
      // }
      // this.loadingProvider.closeLoading();
      // });
    }, (err) => {
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

}
