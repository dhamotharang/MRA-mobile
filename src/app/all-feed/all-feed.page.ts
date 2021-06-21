import { Component, OnInit } from '@angular/core';
import { LoadingProvider } from 'src/providers/loading-provider';
import { Storage } from '@ionic/storage-angular';
import { RestProvider } from 'src/providers/rest/rest';
import { ImageProvider } from 'src/providers/image.provider';
import { EventProvider } from 'src/providers/event.provider';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import _ from 'lodash';
import { async } from '@angular/core/testing';


@Component({
  selector: 'app-all-feed',
  templateUrl: './all-feed.page.html',
  styleUrls: ['./all-feed.page.scss'],
})
export class AllFeedPage implements OnInit {
  role: any;
  projectList: any;
  feedList = [];
  feedListbyProject: any = [];
  feedUpdatedList: any = [];

  constructor(
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private imageProvider: ImageProvider,
    private eventProvider: EventProvider,
    private cacheHandlerProvider: CacheHandlerProvider 

  ) { }



  ionViewWillEnter() {
    this.getAllProjectFeed();
  }

  ngOnInit() {
    // this.getAllProjectFeed();
    // this.storage.get('role').then((val:any) => {
    //   this.role = val
    //   if (this.role == 'staff') {
    //     this.getStaffInvolved();
    //   }
    //   else {
    //     this.getVolunteerInvolved();
    //   }
    // })
  }

  getAllProjectFeed() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getAllProjectFeed(val).then((result:any) => {
        console.log('getListProjects',result);
        this.feedList = result;
        this.getFeedImg()
        this.loadingProvider.closeLoading();
      }, (err) => {
        this.loadingProvider.closeLoading();
        console.log('getListProjects err',err);
      });

    });

  }


  getFeedImg() {
    if (this.cacheHandlerProvider.galleryImage.length == 0) {
      let res = [];
      this.restProvider.getFeedImg().then((result:any) => {
      this.categorizedFeedImg(result);
      }, (err) => {
        console.log(err);
      });
    }
    else {
      let p = this.cacheHandlerProvider.galleryImage;
      this.categorizedFeedImg(p);

    }

  }

   categorizedFeedImg(p) {
    if (p.length != 0) {
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
    }
    console.log('feedList',this.feedList);
    this.feedUpdatedList = this.feedList;
    this.categorizedFeed()
  }

  categorizedFeed() {
    let res = [];
    let p = this.cacheHandlerProvider.projectInvolved
    if (this.feedUpdatedList.length != 0) {
      for(let i=0; i < this.feedUpdatedList.length; i++){
        res = p.filter(x => x.projId == this.feedUpdatedList[i].projId)
        if (res.length != 0) {
          this.feedUpdatedList[i]['projName'] = res[0].proj.projName
        }
      }
      console.log('feedUpdatedList',this.feedUpdatedList);
      this.feedListbyProject = this.groupByProject(this.feedUpdatedList, 'projId')
      console.log('feedListbyProject',this.feedListbyProject)
    }
  }


  groupByProject(list, projId) {
    let result: any = _(list)
      .groupBy(projId)
      .map((value, projId) => ({ projId, item: value }))
      .value();
    return result;
  }

   


 
  //  categorizedFeed(p) {
  //    let res = [];
  //    for(let i=0; i < this.feedList.length; i++){
  //      res = p.filter(x => x.feedId == this.feedList[i].feedId)
  //      if (res.length != 0) {
  //        let imgList= []
  //        imgList = imgList.concat(res)
  //        this.feedList[i]['feedImg'] = imgList;
  //      }
  //      else {
  //        this.feedList[i]['feedImg'] = null;
  //      }
  //    }
  //    console.log('feedList',this.feedList);
  //  }



  // getStaffInvolved() {
  //   this.loadingProvider.presentLoading();
  //   this.storage.get('defaultPersonId').then((val:any) => {
  //     this.restProvider.getStaffProjectList(val).then((result:any) => {
  //       console.log('getListProjects',result);
  //       this.projectList = result;
  //       this.getLiveFeed();
  //       this.loadingProvider.closeLoading();
  //     }, (err) => {
  //       this.loadingProvider.closeLoading();
  //       console.log('getListProjects err',err);
  //       // this.loadingProvider.closeLoading();
  //       // this.showAlert();
  //     });

  //   });

  // }

  // getVolunteerInvolved() {
  //   this.loadingProvider.presentLoading();
  //   this.storage.get('defaultPersonId').then((val:any) => {
  //       this.restProvider.getProjectInvolvedList(val).then((result:any) => {
  //         console.log('getListProjects',result);
  //         let p = result.filter(x => x.joinStatus == 'A')
  //         this.projectList = p;
  //         this.getLiveFeed();
  //         this.loadingProvider.closeLoading();
  //       }, (err) => {
  //         this.loadingProvider.closeLoading();
  //         // console.log(err);
  //         // this.loadingProvider.closeLoading();
  //         // this.showAlert();
  //       });
  //     });
  // }

  // async getLiveFeed() {
  //   for(let i=0; i < this.projectList.length; i++){
  //     await this.restProvider.getProjectFeed(this.projectList[i].projId).then((result:any) => {
  //       this.feedList = this.feedList.concat(result)
  //       this.loadingProvider.closeLoading();
  //     }, (err) => {
  //       // console.log(err);
  //       this.loadingProvider.closeLoading();
  //       // this.loadingProvider.closeLoading();
  //       // this.showAlert();
  //     });

  //   }
  //   console.log('feedList',this.feedList)
  // }

  

}
