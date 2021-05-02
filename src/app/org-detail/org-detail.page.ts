import { Component, OnInit } from '@angular/core';
import { LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
// import { TypeModal } from '../type-modal/type-modal';
// import { PendingRequestPage } from '../pending-request/pending-request';
// import { distDrive } from '../asnaf-dist-drive/asnaf-dist-drive';

@Component({
  selector: 'app-org-detail',
  templateUrl: './org-detail.page.html',
  styleUrls: ['./org-detail.page.scss'],
})
export class OrgDetailPage implements OnInit {
  storage: any;
  profilePictUrl: any;
  personName: any;
  userDefaultId: any;
  oaid: any;
  org: any;
  showAsnaf: boolean;
  events: any;
  navCtrl: any;
  alertCtrl: any;
  restProvider: any;
  zone: any;
  showAdmin: any;
  showSecretary: any;
  showTreasury: any;
  showCommon: any;
  showSecurity: any;
  showNone: boolean;
  pendingList: any;
  badgeCounter: any;
  noticeList: any;
  actionSheetCtrl: any;
  translate: any;
  platform: any;
  loadingProvider: any;
  file: any;
  fileOpener: any;
  counter: number;
  isFull: any;
  temp: any;
  iab: any;
  launchNavigator: any;
  geolocation: any;
  orgs:any =[];
  socialSharing: any;
  calendar: any;
  secureURL: any[];
  restParam:any;
  private _element: any;
  today: Date;
 
  constructor(
   

  ) { }

  ngOnInit() {
  }
  ionViewDidLoad() {
    this.storage.get('profilePictUrl').then((val:any) => {
      this.profilePictUrl = val;
    });
    this.storage.get('defaultProfile').then((val:any) => {
      this.personName = val.name;
      this.userDefaultId = val.personId;
    });
    this.storage.get('oaid').then((val:any) => {
      this.oaid = val;
    });

    this.today = new Date();
    this.checkRole();
    this.getOrgAnnouncement();
    this.checkModule(this.org.orgProfile.module.modId);
  }
  checkModule(modid){
    if(modid == 4){
      this.showAsnaf = true;
    }
  }

  onEvent(event: string, item: any, e: any) {
      if (e) {
          e.stopPropagation();
      }
      if (this.events[event]) {
          this.events[event](item);
      }
  }
  findvehicle(){
    //this.navCtrl.push(VehiclehistoryPage,{data:this.org});
  }
  visitpass(){
    //this.navCtrl.push(VisitotpassPage,{data:this.org});
  }

  watch(){
    this.navCtrl.push("SosWatch");
  }

  qrscanner(){
    //this.navCtrl.push(QrcodescanPage,{data:this.org});
  }

  createQR(){
    //this.navCtrl.push(CreateqrPage,{data:this.org});
  }

  showAlert() {
    const alert = this.alertCtrl.create({
     Headers: 'Oops!',
      subHeader: 'Something went wrong. Please try again later.',
      buttons: ['OK']
    });
    alert.present();
  }
  checkRole(){
    //roId 1= admin, 4= secretarial, 5 = Treasury, 9= common
    this.restProvider.checkRole(this.org.personId).then((result:any) => {
      console.log("task.ts: "+result);
      this.zone.run(() => {// to make sure UI view is updating
        this.showAdmin = result[0];
        this.showSecretary = result[1];
        this.showTreasury = result[2];
        this.showCommon = result[3];
        this.showSecurity = result[4];
        if(!this.showAdmin && !this.showSecretary && !this.showTreasury && !this.showCommon && !this.showSecurity){
          this.showNone = true;
        }
        if(this.showSecretary){
          this.getPendingRequest();
        }
        this.checkModule(this.org.orgProfile.module.modId);
      });
    });
  }
  getPendingRequest(){
    this.restProvider.getRequestList(this.org.orgId).then((result:any) => {
      console.log(result);
      this.pendingList = result;
      for(let i=0; i<this.pendingList.length; i++){
          this.badgeCounter++ ;
      }
    }, (err) => {
      console.log(err);
      this.showAlert();
    });
  }
  detail(i){
    if(this.showSecretary){
    //   this.navCtrl.push(LayoutDetails,{data:this.noticeList[i],editable: true, host:true, from:'orgDetail'});
    // }else{
    //   this.navCtrl.push(LayoutDetails,{data:this.noticeList[i],editable: false, host:true, from:'orgDetail'});
   }
  }
  more(i){
    if(this.noticeList[i].paramType == "PE"){
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: this.translate.instant('Guest List'),
            icon: !this.platform.is('ios') ? 'download' : null,
            handler: () => {
              this.pdf(i);
            }
          },{
            text: this.translate.instant('Edit Post'),
            icon: !this.platform.is('ios') ? 'create' : null,
            handler: () => {
              this.edit(i);
            }
          },{
            text: this.translate.instant('Delete Post'),
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.deleteConfirm(i);
            }
          }
        ]
      });
      actionSheet.present();
    }else if(this.noticeList[i].paramType == "DA"){
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: this.translate.instant('Delete Post'),
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.deleteConfirm(i);
            }
          }
        ]
      });
      actionSheet.present();
    }else{
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: this.translate.instant('Edit Post'),
            icon: !this.platform.is('ios') ? 'create' : null,
            handler: () => {
              this.edit(i);
            }
          },{
            text: this.translate.instant('Delete Post'),
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.deleteConfirm(i);
            }
          }
        ]
      });
      actionSheet.present();
    }
  }
  async pdf(i){
    //this.loadingProvider.setupLoading();
    try {
      let app = await this.restProvider.appConf("MBEA");
      var url = app[0].host+"/"+app[0].url+"?ac_id="+this.noticeList[i].acId;
      console.log(url);
      var targetPath = this.file.externalRootDirectory + "AttendanceList.pdf";
      this.restProvider.getReport(url, targetPath).then( (result:any) => {
        this.loadingProvider.closeLoading();
        this.showConfirm(result);
      }, (error) => {
        console.log(error);
        this.loadingProvider.closeLoading();
      });
    }
    catch (err) {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.showAlert();
    }
  }
  showConfirm(url) {
    const confirm = this.alertCtrl.create({
     Headers: 'AttendanceList PDF',
     subHeader: 'file is saved at '+ url,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'View?',
          handler: () => {
            console.log('Agree clicked');
            let targetPath = this.file.externalRootDirectory + "AttendanceList.pdf";
            this.fileOpener.open(targetPath, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch(e => {
              console.log('Error opening file', e);
              const alert = this.alertCtrl.create({
                Header: 'Error!',
                subHeader: 'Opening file issue. Please try again later.',
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }
      ]
    });
    confirm.present();
  }
  deleteConfirm(i) {
    const confirm = this.alertCtrl.create({
     Headers: 'Delete this post?',
    subHeader: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(this.noticeList[i].acId);
          }
        }
      ]
    });
    confirm.present();
  }

  edit(i){
    if(this.noticeList[i].paramType != 'PE'){
      this.navCtrl.push('CreatePost' ,{
        editable:this.noticeList[i],
        tag: null,
        type:null,
        from:"main"
      });
    }else{
      this.navCtrl.push('CreateEvent' ,{
        editable:this.noticeList[i],
        tag: null,
        type:null,
        from:"main"
      });
    }
  }

  delete(id){
    //this.loadingProvider.setupLoading();
    this.restProvider.deleteHosting(id).then((result:any) => {
      console.log(result);
      this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.showAlert();
    });
  }
  goto(x){
    switch(x){
      case 1: {
         //this.navCtrl.push(TypeModal,{type:1,module:'AN',org:this.org});
         break;
      }
      case 2: {
        // this.navCtrl.push(TypeModal,{type:2,module:'AN',org:this.org});
         break;
      }
      case 3: {
        // this.navCtrl.push(TypeModal,{type:3,module:'AN',org:this.org});
         break;
      }
    }
  }
  committee(){
    this.navCtrl.push("CommitteePage", {org:this.org});
  }

  about(){
    this.navCtrl.push("OrgAbout",{data: this.org.orgProfile, type: 'active'});
  }

  myaccount(){
    this.navCtrl.push("MyAccountPage", {org:this.org});
  }

  management(){
    this.navCtrl.push("ManagementPage", {
      org:this.org,
      showAdmin:this.showAdmin,
      showSecretary:this.showSecretary,
      showTreasury:this.showTreasury,
      showCommon:this.showCommon
    });
  }
     //from hv two options 1.task 2.notif
     request(){
     // this.navCtrl.push(PendingRequestPage, {org:this.org, from:'task'});
    }

    asnaf(){
     // this.navCtrl.push(distDrive, {org:this.org, from:'task'});
    }

    getOrgAnnouncement(){
      //this.loadingProvider.setupLoading();
      this.counter = 0;
      this.noticeList = [];
      this.restProvider.getOrgAnnouncement(this.org.orgId,this.counter).then((result:any) => {
        console.log(result);
        if(result == null){
          this.noticeList.length = 0;
          this.loadingProvider.closeLoading();
        }else{
          // to make sure UI view is updatinig
          // this.zone.run(() => {
            this.noticeList = result;
            for(let i=0; i<this.noticeList.length; i++){
              this.isFull.push(false);
              this.noticeList[i].programEndDate = this.noticeList[i].programEnd;
              let x = this.process(this.noticeList[i]);
              this.noticeList[i] = x;
              this.noticeList[i].createdDate = this.calcElapsed(this.noticeList[i].createdDate);
            }
           // });
          this.enableDynamicHyperlinks();
          this.loadingProvider.closeLoading();
        }
      }, (err) => {
        console.log(err);
        this.loadingProvider.closeLoading();
        this.showAlert();
      });
    }
    calcElapsed(timestamp):string{
      console.log('ori '+timestamp);
      const since = new Date(timestamp).getTime(),
            elapsed = (new Date().getTime() - since) / 1000;
        console.log("elapse  "+elapsed);
       if (elapsed >= 0) {
         const diff = {days:0,hours:0,minutes:0,seconds:0};

         diff.days    = Math.floor(elapsed / 86400);
         diff.hours   = Math.floor(elapsed / 3600 % 24);
         diff.minutes = Math.floor(elapsed / 60 % 60);
         diff.seconds = Math.floor(elapsed % 60);
         if(diff.days > 0){
           return diff.days.toString() + 'd';
         }else if(diff.hours > 0){
           return diff.hours.toString() + 'h';
         }else if(diff.minutes > 0){
           return diff.minutes.toString() + 'm';
         }else if(diff.seconds > 0){
           return diff.seconds.toString() + 's';
         }
         console.log('ok '+diff);
       }
       else {
         console.log('Elapsed time lesser than 0, i.e. specified datetime is still in the future.');
       }
    }
    doRefresh(refresher){
      console.log('Refresh operation');
      this.storage.get('defaultProfile').then((val:any) => {
          console.log(val);
          this.personName = val.name;
          // this.phone = val.contactNo;
      });
      this.counter = 0;
      this.restProvider.getOrgAnnouncement(this.org.orgId,this.counter).then((result:any) => {
        console.log("refresh result  "+result);
        if(result == null){
          this.noticeList = null;
          refresher.complete();
        }else{
          // to make sure UI view is updatinig
          // this.zone.run(() => {
            this.isFull = [];
            this.noticeList = result;
            for(let i=0; i<this.noticeList.length; i++){
              this.isFull.push(false);
              let x = this.process(this.noticeList[i]);
              this.noticeList[i] = x;
              this.noticeList[i].createdDate = this.calcElapsed(this.noticeList[i].createdDate);
            }
            this.enableDynamicHyperlinks();
           // });
         }
        refresher.complete();
      }, (err) => {
        console.log(err);
        refresher.complete();
        this.showAlert();
      });
    }
    doInfinite(): Promise<any> {
      console.log('Begin async operation');
      return new Promise((resolve) => {
        this.counter = this.counter + 5;
        this.restProvider.getOrgAnnouncement(this.org.orgId,this.counter).then((result:any) => {
          //console.log(result.results);
          if(result == null){
           // resolve();
          }else{
            // to make sure UI view is updatinig
            // this.zone.run(() => {
              this.temp = result;
              for(let i=0; i<this.temp.length; i++){
                this.isFull.push(false);
                let x = this.process(this.temp[i]);
                this.temp[i].createdDate = this.calcElapsed(this.temp[i].createdDate);
                this.noticeList.push(x);
              }
            // });
            console.log(this.noticeList);
            this.enableDynamicHyperlinks();
            //resolve();
          }

        }, (err) => {
          console.log(err);
          this.showAlert();
        });
      })
    }

    process(list){
      for(let i=0; i < list.mtAnnouncementUploadList.length; i++){
        if(list.mtAnnouncementUploadList[i].filetype === 'video'){
          console.log('yes');
          let file = list.mtAnnouncementUploadList[i].filepath;
          let base = file.substring(file.lastIndexOf('.'),0);
          console.log(base);
          list.mtAnnouncementUploadList[i].thumbnail = base;

        }else if(list.mtAnnouncementUploadList[i].filetype === 'image'){
          list.mtAnnouncementUploadList[i].thumbnail = null;
        }
      }
      if(list.programStart != null){
       // list.programStart = format(new Date(list.programStart), 'ddd, MMM DD/YY')+" AT "+format(new Date(list.programStart), 'hh:mm A');
        //list.programEnd = format(new Date(list.programEnd), 'ddd, MMM DD/YY')+" AT "+format(new Date(list.programEnd), 'hh:mm A');
      }
      return list;
    }

    processDate(date){
      console.log(date);
      // let x = someString.substring(someString.length-2, 0);
      let x = date.split("AT");
      let x1 = x[0]+x[1];
      console.log('x1 ',x1);
      // let x2 = format(new Date(x1), 'DD MMM, YYYY HH:mm');
      // console.log('x2 ',x2);
      let x3 = new Date(x1).toISOString();
      console.log('x3 ',x3);
      //return format(new Date(x3));
    }

    calendarDate(date){
      console.log(date);
      let x = date.split("AT");
      let x1 = x[0]+x[1];
     // let x2 = format(new Date(x1), 'DD MMM, YYYY HH:mm');
     // return new Date(x2);
    }

  enableDynamicHyperlinks(){
     // Provide a minor delay to allow the HTML to be rendered and 'found'
     // within the view template
     setTimeout(() =>
     {
        // Query the DOM to find ALL occurrences of the <a> hyperlink tag
        const urls : any    = this._element.nativeElement.querySelectorAll('a');

        // Iterate through these
        urls.forEach((url) =>
        {
           // Listen for a click event on each hyperlink found
           url.addEventListener('click', (event) =>
           {
              // Retrieve the href value from the selected hyperlink
              event.preventDefault();
              let link = event.target.href;

              // Log values to the console and open the link within the InAppBrowser plugin
              console.log('Name is: ' + event.target.innerText);
              console.log('Link is: ' + link);
              this.launchInAppBrowser(link);
           }, false);
        });
     }, 2000);
  }

  launchInAppBrowser(link){
   let opts : string = "location=yes,clearcache=yes,hidespinner=no"
   this.iab.create(link, '_blank', opts);
  }
  updateRSVP(i){
    console.log("updateRSVP");
    const confirm = this.alertCtrl.create({
     Headers: 'Response to RSVP.',
     subHeader: 'Please state your attendance fot the event?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Not Attend',
          handler: () => {
            // //this.loadingProvider.setupLoading();
    this.restProvider.updateRSVP(this.noticeList[i].eiId,'N').then((result:any) => {
      console.log(result);
      this.noticeList[i].attendance = result.status;

      // this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      this.showAlert();
    });
            this.getOrgAnnouncement();
            console.log('Not Attend clicked');
          }
        },
        {
          text: 'Attend',
          handler: () => {
            // //this.loadingProvider.setupLoading();
    this.restProvider.updateRSVP(this.noticeList[i].eiId,'Y').then((result:any) => {
      console.log(result);
      this.noticeList[i].attendance = result.status;
      // this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      // this.loadingProvider.closeLoading();
      this.showAlert();
    });
           this.getOrgAnnouncement();
            console.log('Attend clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  preRegister(i){
    //this.loadingProvider.setupLoading();
    let person ={
      personId: this.userDefaultId,
    }
    let register = {
      acId : this.noticeList[i].acId,
      orgId : this.noticeList[i].orgId,
      attendanceStatus : 'Y',
      registrationMethod : 'P',
      confirm : 'N',
      bodyTemp : null,
      person : person
    };

    console.log('register',JSON.stringify(register));
    this.restProvider.preRegistration(register).then((result:any) => {
      console.log(result);
      this.loadingProvider.closeLoading();
      const alert = this.alertCtrl.create({
       Headers: 'Confirmation!',
        subHeader: 'Your attendance have been registered!',
        buttons: [{
          text: 'Okay',
          handler: () => {
            this.getOrgAnnouncement();
            console.log('Cancel clicked');
          }
        }]
      });
      alert.present();
      // this.navCtrl.pop();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.showAlert();
    });

  }

  launch(location){
    let options = {timeout: 10000, enableHighAccuracy: true};
    this.geolocation.getCurrentPosition(options).then((pos) => {
      console.log(pos.coords.latitude,pos.coords.longitude);
      let options: LaunchNavigatorOptions = {
        start: [pos.coords.latitude,pos.coords.longitude],
      };

      this.launchNavigator.navigate(location, options).then(
        success => console.log('Launched navigator'),
        error => {
          console.log('Error launching navigator', error);
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Please install navigation app.',
            buttons: ['OK']
          });
          alert.present();
        });
    }).catch((error) => {
      console.log('Error getting location', error);
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'Could not get current location.',
        buttons: ['OK']
      });
      alert.present();
    });
  }
  share(i){
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translate.instant('Community Share'),
          icon: !this.platform.is('ios') ? 'share-comm' : null,
          handler: () => {
            this.getOrg(i);
          }
        },{
          text: this.translate.instant('Facebook share'),
          icon: !this.platform.is('ios') ? 'logo-facebook' : null,
          handler: () => {
            this.facebookShare(i);
          }
        },{
          text: this.translate.instant('Twitter Share'),
          icon: !this.platform.is('ios') ? 'logo-twitter' : null,
          handler: () => {
            this.twitterShare(i);
          }
        }
        ,{
          text: this.translate.instant('Whatsapp Share'),
          icon: !this.platform.is('ios') ? 'logo-whatsapp' : null,
          handler: () => {
            this.whatsapp(i);
          }
        }
      ]
    });
    actionSheet.present();
  }

  getOrg(i){
    //this.loadingProvider.setupLoading();
    this.restProvider.getOrg(this.oaid).then((result:any) => {
      console.log(result);
      this.orgs = result;
      this.loadingProvider.closeLoading();
      this.communityShare(i);
    }, (err) => {
      this.loadingProvider.closeLoading();
      console.log(err);
      this.orgs = [];
    });
  }

  communityShare(index){
      let alert = this.alertCtrl.create();
      alert.setTitle('Select Community');
      for(let i=0; i <this.orgs.length; i++){
        alert.addInput(
          {
          type: 'radio',
          label: this.orgs[i].orgName,
          value: this.orgs[i],
          checked: false
          });
      }

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
         if(data != undefined){
            console.log(data);
            this.shareAnnouncement(index,data);
          }
        }
      });
      alert.present();
  }
  //Note that a lot of apps support sharing multiple files, but Twitter just doesn't accept more that one file.
    twitterShare(i){
      //this.loadingProvider.setupRedirect();
      var img = null;
      if(this.noticeList[i].mtAnnouncementUploadList.length > 0){
        img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
      }
      var msg  = 'Shared via MyJiran App http://www.myjiran.my \n'+
                  this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n'+
                  this.noticeList[i].title+ '\n' +
                  this.noticeList[i].notes;

      if(this.noticeList[i].location != null){
        // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
        msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
      }
      if(this.noticeList[i].programStart != null){
        msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
      }
      if(this.noticeList[i].programEnd != null){
        msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
      }
      this.socialSharing.shareViaTwitter(msg, img, null)
      .then((result) =>
      {
        console.log("Share Success" , result);
        //this.loadingProvider.closeRedirect();
      })
      .catch((err) =>
      {
        console.log("Share Fail" , JSON.stringify(err));
        //this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          title: 'Share Fail!',
          subTitle: 'Please download Twitter App to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
    }
  //you can prompt the user to paste the message you've passed to the plugin because we're adding it to the clipboard for you.
    facebookShare(i){
      //this.loadingProvider.setupRedirect();
      var img = null;
      if(this.noticeList[i].mtAnnouncementUploadList.length > 0){
        img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
      }
      var msg  = 'Shared via MyJiran App http://www.myjiran.my \n'+
                  this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n'+
                  this.noticeList[i].title+ '\n' +
                  this.noticeList[i].notes;

      if(this.noticeList[i].location != null){
        // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
        msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
      }
      if(this.noticeList[i].programStart != null){
        msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
      }
      if(this.noticeList[i].programEnd != null){
        msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
      }
      //sharing a message is not possible.
      //You can share either a link or an image (not both), but a description can not be prefilled.
      this.socialSharing.shareViaFacebookWithPasteMessageHint(msg, img, null, 'Please paste message from your cilpboard')
      .then((result) =>
      {
        console.log("Share Success" , result);
        //this.loadingProvider.closeRedirect();
      })
      .catch((err) =>
      {
        console.log("Share Fail" , JSON.stringify(err));
        //this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          title: 'Share Fail!',
          subTitle: 'Please download Facebook App to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
    }

    whatsapp(i){
      //this.loadingProvider.setupRedirect();
      var img = null;
      if(this.noticeList[i].mtAnnouncementUploadList.length > 0){
        img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
      }
      var msg  = 'Shared via MyJiran App http://www.myjiran.my \n'+
                  this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n'+
                  this.noticeList[i].title+ '\n' +
                  this.noticeList[i].notes;

      if(this.noticeList[i].location != null){
        // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
        msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
      }
      if(this.noticeList[i].programStart != null){
        msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
      }
      if(this.noticeList[i].programEnd != null){
        msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
      }
      this.socialSharing.shareViaWhatsApp(msg, img, null)
      .then((result) =>
      {
        console.log("Share Success" , result);
        //this.loadingProvider.closeRedirect();
      })
      .catch((err) =>
      {
        console.log("Share Fail" , JSON.stringify(err));
        //this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          title: 'Share Fail!',
          subTitle: 'Please download WhatsApp to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
    }

  getPermission(i){
    this.calendar.hasReadWritePermission().then((result) => {
      console.log('Has permission?',result);
      if(result == true){
        this.initCalendar(i);
      }else{
        this.initCalendar(i);
        // this.calendar.requestReadWritePermission().then((res) => {
        //   console.log('request permission?',res);
        //   if(res == true){
        //     this.initCalendar(i);
        //   }else{
        //     const alert = this.alertCtrl.create({
        //       title: 'Warning!',
        //       subTitle: 'You have denied calendar Read/Write permission. Cannot proceed.',
        //       buttons: ['OK']
        //     });
        //     alert.present();
        //   }
        // },(err) =>{
        //   console.log(err);
        //   const alert = this.alertCtrl.create({
        //     title: 'Oops!',
        //     subTitle: 'Theres issue when requesting calendar Read/Write permission.',
        //     buttons: ['OK']
        //   });
        //   alert.present();
        // });
      }
    },(err) => {
      console.log(err);
      const alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Theres issue during checking calendar Read/Write permission.',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  initCalendar(i){
    //this.loadingProvider.setupSaving();
    var start = this.calendarDate(this.noticeList[i].programStart);
    var end = this.calendarDate(this.noticeList[i].programEnd);

    this.calendar.createEvent(this.noticeList[i].title, this.noticeList[i].location, this.noticeList[i].notes, start, end).then((result) => {
      this.loadingProvider.closeSaving();
      const alert = this.alertCtrl.create({
        title: 'Sucessful',
        subTitle: 'Event has been saved to your calendar.',
        buttons: ['OK']
      });
      alert.present();
    },(err) => {
      console.log(err);
      this.loadingProvider.closeSaving();
      if(err === "Please allow access to the Calendar and try again."){
        const alert = this.alertCtrl.create({
          title: 'Oops!',
          subTitle: 'Please allow access to the Calendar and try again.',
          buttons: ['OK']
        });
        alert.present();
      }else{
        const alert = this.alertCtrl.create({
          title: 'Oops!',
          subTitle: 'Theres issue during saving process in calendar.',
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  shareAnnouncement(i,org){
    //this.loadingProvider.setupSharing();
    this.secureURL = [];
    if(this.noticeList[i].mtAnnouncementUploadList.length > 0){
      for(let x = 0; x<this.noticeList[i].mtAnnouncementUploadList.length; x++){
        let con = {
          filetype: this.noticeList[i].mtAnnouncementUploadList[x].filetype,
          filepath: this.noticeList[i].mtAnnouncementUploadList[x].filepath
        };
        this.secureURL.push(con);
      }
    }

    if(this.noticeList[i].paramType == 'PE'){
      var start = this.processDate(this.noticeList[i].programStart);
      var end = this.processDate(this.noticeList[i].programEnd);
    }else{
     // var start = this.noticeList[i].programStart;
     // var end = this.noticeList[i].programEnd;
    }

    if(this.noticeList[i].privateEvent == 'Y'){
      var privateState = true;
    }else{
      var privateState = false;
    }

      this.restParam = [{
        personId : org.personId, //sharer id
        referFrom : this.noticeList[i].personId,
        hostId : this.noticeList[i].hostId, //original poster
        orgId : org.orgId,
        title : this.noticeList[i].title,
        notes : this.noticeList[i].notes,
        programStart: start,
        programEnd: end,
        location : this.noticeList[i].location,
        duration : 7,
        subModule: "AN",
        paramType : this.noticeList[i].paramType,
        mtAnnouncementUpload : this.secureURL,
        orgName : this.noticeList[i].hostOrgName,
        orgLogo : this.noticeList[i].orgLogo,
        privateEvent: privateState,
        rsvp: false,
        invitee: []
      }];

    console.log("restParam "+ JSON.stringify(this.restParam));
    const formData: FormData = new FormData();
    formData.append('params', new Blob([JSON.stringify(this.restParam)], {
                type: "application/json"
            }));
    this.restProvider.createAnnouncement(formData).then((result:any) => {
      console.log(result);
      //this.loadingProvider.closeSharing();
    }, (err) => {
      console.log(err);
      //this.loadingProvider.closeSharing();
      this.showAlert();
    });
  }

  }

