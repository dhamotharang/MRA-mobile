import { Component, OnInit } from '@angular/core';
import { LoadingProvider } from 'src/providers/loading-provider';
import { Storage } from '@ionic/storage-angular';
import { RestProvider } from 'src/providers/rest/rest';
import { ImageProvider } from 'src/providers/image.provider';

@Component({
  selector: 'app-all-feed',
  templateUrl: './all-feed.page.html',
  styleUrls: ['./all-feed.page.scss'],
})
export class AllFeedPage implements OnInit {
  role: any;
  projectList: any;
  feedList = [];

  constructor(
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private imageProvider: ImageProvider,
  ) { }

  ngOnInit() {
    this.storage.get('role').then((val:any) => {
      this.role = val
      if (this.role == 'staff') {
        this.getStaffInvolved();
      }
      else {
        this.getVolunteerInvolved();
      }
    })
  }

  getStaffInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getStaffProjectList(val).then((result:any) => {
        console.log('getListProjects',result);
        this.projectList = result;
        this.getLiveFeed();
        this.loadingProvider.closeLoading();
      }, (err) => {
        this.loadingProvider.closeLoading();
        console.log('getListProjects err',err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });

    });

  }

  getVolunteerInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
        this.restProvider.getProjectInvolvedList(val).then((result:any) => {
          console.log('getListProjects',result);
          let p = result.filter(x => x.joinStatus == 'A')
          this.projectList = p;
          this.getLiveFeed();
          this.loadingProvider.closeLoading();
        }, (err) => {
          this.loadingProvider.closeLoading();
          // console.log(err);
          // this.loadingProvider.closeLoading();
          // this.showAlert();
        });
      });
  }

  async getLiveFeed() {
    for(let i=0; i < this.projectList.length; i++){
      await this.restProvider.getProjectFeed(this.projectList[i].projId).then((result:any) => {
        this.feedList = this.feedList.concat(result)
        this.loadingProvider.closeLoading();
      }, (err) => {
        // console.log(err);
        this.loadingProvider.closeLoading();
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });

    }
    console.log('feedList',this.feedList)
  }
  

}
