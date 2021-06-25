import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import * as moment from 'moment';
import { LoadingProvider } from 'src/providers/loading-provider';
import { AlertProvider } from 'src/providers/alert-provider';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  andList: any;
  // iosList: any;
  pushList: any = [];
  orgId: any;
  profile: any;
  restParam: any = [];
  // mediaList:any = [];
  notiList: any = [];
  profilePictUrl: any;
  allCommiteeList: any = [];
  projectsInvited: any = [];

  constructor(
    private restProvider: RestProvider,
    private storage: Storage,
    private loadingProvider: LoadingProvider,
    private alertProvider: AlertProvider,
    private cacheHandlerProvider: CacheHandlerProvider
  ) { }

  ionViewWillEnter() {
    this.storage.get('defaultProfile').then((val:any) => {this.profile = val; this.getListNoti() })
    this.storage.get('personOrgs').then((val:any) => {this.orgId = val})
    this.storage.get('profilePictUrl').then((val:any) => { this.profilePictUrl = val});
  }

  async ngOnInit() {
  }



  getListNoti() {
    this.restProvider.getListNoti(this.profile.personId).then((res: any) => {
      this.notiList = [];
      this.notiList = res.sort((a, b) => b.createdDate - a.createdDate)
      this.categorizedNoti(this.cacheHandlerProvider.projectInvolved)
      // this.storage.get('projectsInvited').then((val:any) => {this.categorizedNoti(val)})
    }).catch(error => {
      console.log('getListNotiErr',error);
    })
  }


  categorizedNoti(p) {
    if (this.cacheHandlerProvider.projectInvolved.length != 0) {
      let res = [];
      for(let i=0; i < this.notiList.length; i++){
        res = p.filter(x => x.projId == this.notiList[i].projectId)
        if (res.length != 0) {
          this.notiList[i]['volId'] = res[0].volunteerId;
        }
        else {
          this.notiList[i]['volId'] = null;
        }
      }
      console.log('categorizedNoti',this.notiList);
    }

  }



  //check if project already accept/not. to hide accept/reject button
  notAccept(data) {
    let p = [];
    p = this.notiList.filter(x => x.paramType == 'A' && x.projectId == data.projectId)
    if (p.length != 0) {
      return false
    }
    else {
      return true
    }
  
  }

  acceptJoin(data) {
    this.loadingProvider.presentLoading();
    let param = {
      projId:data.projectId,
      personId:this.profile.personId,
      enabled:'Y',
      createdDate: new Date(),
      voidStatus: "A",
      joinStatus: "A",
      volunteerId: data.volId
    };
    this.restProvider.answerJoin(param).then((result:any) => {
      this.loadingProvider.closeLoading();
      this.getCommittee(data, param)
      this.alertProvider.successAlert()
    }, (err) => {
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert()
    });

  }



  getCommittee(data, param) {
    this.restProvider.getStaffList(data.projectId).then((result:any) => {
      this.allCommiteeList = []   //reset list
      for (let i = 0; i < result.length; i++) {
        this.allCommiteeList.push(result[i].person)
      }
      this.allCommiteeList.push(this.profile)
      this.loadingProvider.closeLoading();
      this.createAnnouncement(data, param)
    }, (err) => {
      // this.loadingProvider.closeLoading();
      // console.log(err);
      this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }




  rejectJoin(data) {
    let param = {
      projId:data.projectId,
      personId:this.profile.personId,
      enabled:'Y',
      createdDate: new Date(),
      voidStatus: "A",
      joinStatus: "D",
      volunteerId: data.volId
    };
    this.restProvider.answerJoin(param).then((result:any) => {
      this.loadingProvider.closeLoading();
      this.createAnnouncement(data,param)
      this.alertProvider.successAlert()
    }, (err) => {
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert()
    });
  }



  createAnnouncement(data, type) {
    let Type;
    if (type.joinStatus == 'A' || type.joinStatus == 'Q') {
      Type = 'accept'
    }
    else {
      Type = 'reject'    
    }
    for (let i = 0; i < this.allCommiteeList.length; i++) {
      let param = {
        personId : this.allCommiteeList[i].personId,   //send to diri sndiri (sbb nk guna utk logic hide button)
        hostId : this.profile.personId,
        profilePictUrl: this.profile.profilePictUrl,
        referFrom : null,
        orgId : data.orgId,
        title : this.profile.name +' '+ Type +' '+ data.title,
        notes : this.profile.name +' '+ Type +' '+ data.title,
        programStart: data.programStart,
        programEnd: data.programEnd,
        location : data.location,
        duration : 7,
        subModule: 'AN',
        paramType : 'A',
        privateEvent: false,
        orgName : 'Malaysian Relief Agency',
        orgLogo : data.orgLogo,
        projectId : data.projectId
      };
      this.restParam.push(param)
    }
    console.log('restParam',this.restParam)
    this.submitAnnouncement();
  }



  async submitAnnouncement(){
    this.loadingProvider.presentLoading();
    let formData = await this.processData();
    await this.restProvider.createAnnouncementCommittee(formData).then((result:any) => {
      this.restParam = [] //reset list
      setTimeout(() => {
        this.getListNoti();
        this.loadingProvider.closeSaving();
      }, 2000)
    }, (err) => {
      this.loadingProvider.closeSaving();
      console.log(err);
    });
  }



  processData(){
    const formData: FormData = new FormData();
    formData.append('params', new Blob([JSON.stringify(this.restParam)], {
                type: "application/json"
            }));
    return formData;
  }


  doRefresh(event) {
    console.log('Begin async operation');
    this.getListNoti();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }





}

  // getToken() {
  //   this.restProvider.getTokenStaff(this.orgId).then((res: any) => {
  //     console.log(res);
  //     this.andList = res.android;
  //     // this.iosList = res.ios;
  //     // this.sendPush();
  //   }).catch(error => {
  //     console.log(error);
  //     // this.showAlert();
  //     // this.loadingProvider.closeSaving();
  //   })

  // }




  // sendPush() {
  //   let time = new Date().getTime();
  //   if (this.andList.length > 0) {
  //     let temp = [];
  //     // for (let i = 0; i < this.andList.length; i++) {
  //     //   temp.push(this.andList[i].token);

  //     // }
  //     temp.push('fFG4kfP9RpCaMKP-lqs5fw:APA91bETaf1Y-Jl8VPGrUtPvqiVW1XBeconI_wtoCWJWLBGJOqTUppfn9LMxBw-6S4YjlXV1xEWHn7Fe0yBAurqAm8bm1O_TKn7ucHFgX7jl7EHs3pdtPn5JCK87oxOUJzA8qopN895e');
  //     let pushData = {
  //       // registration_ids: temp,
  //       // data: {
  //       //   notId: null, // notId on Android needed to be an int and not a string
  //       //   title: 'Volunteer *** have received your invitation',
  //       //   body: 'test description',
  //       //   // avatar: this.profilePictUrl,
  //       //   // who: 'nisa',
  //       //   // type: "feedback",
  //       //   // created: time
  //       // },
  //         notification:{
  //           "title":"Volunteer *** have received your invitation",
  //           "body":"test description",
  //            "click_action":"FCM_PLUGIN_ACTIVITY"
  //         },
  //        to:"fFG4kfP9RpCaMKP-lqs5fw:APA91bETaf1Y-Jl8VPGrUtPvqiVW1XBeconI_wtoCWJWLBGJOqTUppfn9LMxBw-6S4YjlXV1xEWHn7Fe0yBAurqAm8bm1O_TKn7ucHFgX7jl7EHs3pdtPn5JCK87oxOUJzA8qopN895e",
  //           "priority":"high",
  //           "restricted_package_name":""
  //     }
  //     this.pushList.push(pushData);
  //   }
  //   // if(this.iosList.length>0){
  //   //   let temp = [];
  //   //   for(let i=0;i<this.iosList.length;i++){
  //   //     temp.push(this.iosList[i].token);
  //   //   }
  //   //   let pushData = {
  //   //     registration_ids : temp,
  //   //     notification:{
  //   //       title: this.title,
  //   //       body: this.description,
  //   //       sound: "default",
  //   //     },
  //   //     data: {
  //   //       notId: null, // notId on Android needed to be an int and not a string
  //   //       avatar: this.profilePictUrl,
  //   //       who: this.personName ,
  //   //       type:"feedback",
  //   //       created: time
  //   //     }
  //   //   }
  //   //   this.pushList.push(pushData);
  //   // }

  //   this.restProvider.sendPush(this.pushList,this.profile.personId).subscribe((result:any) => {
  //     console.log('here');
  //     console.log(result);
  //   });
  // }
