import { Component, ViewChild, ElementRef, NgZone, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController, Platform, PopoverController } from '@ionic/angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage';
import { LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
//import { LayoutDetails } from './../../components/parallax/layout-details/layout-details';



declare var require: any;
//const format = require('date-fns/format');



@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.page.html',
  styleUrls: ['./user-account.page.scss'],

})
export class UserAccountPage implements OnInit {
  customYearValues = [2020, 2016, 2008, 2004, 2000, 1996];
  customDayShortNames = ['s\u00f8n', 'man', 'tir', 'ons', 'tor', 'fre', 'l\u00f8r'];
  customPickerOptions: any;
  provider: any;

  defaultName: any;
  badgeCounter: number = 0;
  orgs: any = [];
  noticeList: any = [];
  x: string;
  counter: any;
  secureURL: any = [];
  restParam: any;
  isFull: any = [];
  temp: any = [];
  oaid: any;
  translate: any;
  calendar: any;
  fileOpener: any;
  launchNavigator: any;
  actionSheetCtrl: any;
  file: any;
  alertCtrl: any;
  iab: any;
  geolocation: any;
  socialSharing: any;
  reportProvider: any;
  personName: any;
  personID: any;
  profilePictUrl: any;


  constructor(
    public loadingProvider: LoadingProvider,
    public restProvider: RestProvider,
    //public reportProvider: ReportProvider,
    //public translate: TranslateService,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,

    public platform: Platform,

  ) { }
  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.storage.get('defaultProfile').then((val: any) => {
      console.log('getProfile', val)
      this.profile = val;
    });
    this.storage.get('provider').then((val: any) => {
      this.provider = val.providerCode;
    });
    this.storage.get('profilePictUrl').then((val: any) => {
      this.profilePictUrl = val;
    });
    this.storage.get('oaid').then((val: any) => {
      this.oaid = val;
      this.getUserAnnouncement();
    });
  }





  async showAlert() {
    const alert = this.alertCtrl.create({
      Headers: 'Oops!',
      subHeader: 'Something went wrong. Please try again later.',
      buttons: ['OK']
    });
    (await alert).present();
  }

  profile() {
    return this.router.navigateByUrl('/ProfilePage');
  }
  detail(i) {
    // this.navCtrl.navigateRoot(LayoutDetails,{data:this.noticeList[i],editable: true, host:true, from:'userAccount'});
  }
  async more(i) {
    if (this.noticeList[i].paramType == "PE") {
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: this.translate.instant('Guest List'),
            icon: !this.platform.is('ios') ? 'download' : null,
            handler: () => {
              this.pdf(i);
            }
          }, {
            text: this.translate.instant('Edit Post'),
            icon: !this.platform.is('ios') ? 'create' : null,
            handler: () => {
              this.edit(i);
            }
          }, {
            text: this.translate.instant('Delete Post'),
            icon: !this.platform.is('ios') ? 'trash' : null,
            handler: () => {
              this.deleteConfirm(i);
            }
          }
        ]
      });
      actionSheet.present();
    } else if (this.noticeList[i].paramType == "DA") {
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
    } else {
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: this.translate.instant('Edit Post'),
            icon: !this.platform.is('ios') ? 'create' : null,
            handler: () => {
              this.edit(i);
            }
          }, {
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
  async pdf(i) {
    this.loadingProvider.setupLoading();
    try {
      let app = await this.restProvider.appConf("MBEA");
      var url = app[0].host + "/" + app[0].url + "?ac_id=" + this.noticeList[i].acId;
      console.log(url);
      var targetPath = this.file.externalRootDirectory + "AttendanceList.pdf";
      this.reportProvider.getReport(url, targetPath).then((result: any) => {
        this.loadingProvider.closeLoading();
        this.showConfirm(result);
      },
        (error) => {
          console.log(error);
          this.loadingProvider.closeLoading();
        }
      );
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
      subHeader: 'file is saved at ' + url,
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
                  Headers: 'Error!',
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

  edit(i) {
    if (this.noticeList[i].paramType != 'PE') {
      this.router.navigate(['CreatePost'], {
        queryParams: {
          editable: this.noticeList[i],
          tag: null,
          type: null,
          from: "main"
        }
      });
    } else {
      this.router.navigate(['CreateEvent'], {
        queryParams: {
          editable: this.noticeList[i],
          tag: null,
          type: null,
          from: "main"
        }
      });
    }
  }
  delete(id) {
    this.loadingProvider.setupLoading();
    this.restProvider.deleteHosting(id).then((result: any) => {
      console.log(result);
      this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.showAlert();
    });
  }

  getUserAnnouncement() {
    this.loadingProvider.setupLoading();
    this.counter = 0;
    this.restProvider.getUserAnnouncement(this.oaid, this.counter).then((result: any) => {
      console.log(result);
      if (result == null) {
        this.noticeList = null;
        this.loadingProvider.closeLoading();
      } else {
        // to make sure UI view is updatinig
        // this.zone.run(() => {
        this.noticeList = result;
        for (let i = 0; i < this.noticeList.length; i++) {
          this.isFull.push(false);
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
  calcElapsed(timestamp): string {
    console.log('ori ' + timestamp);
    const since = new Date(timestamp).getTime(),
      elapsed = (new Date().getTime() - since) / 1000;
    console.log("elapse  " + elapsed);
    if (elapsed >= 0) {
      const diff = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      diff.days = Math.floor(elapsed / 86400);
      diff.hours = Math.floor(elapsed / 3600 % 24);
      diff.minutes = Math.floor(elapsed / 60 % 60);
      diff.seconds = Math.floor(elapsed % 60);
      if (diff.days > 0) {
        return diff.days.toString() + 'd';
      } else if (diff.hours > 0) {
        return diff.hours.toString() + 'h';
      } else if (diff.minutes > 0) {
        return diff.minutes.toString() + 'm';
      } else if (diff.seconds > 0) {
        return diff.seconds.toString() + 's';
      }
      console.log('ok ' + diff);
    }
    else {
      console.log('Elapsed time lesser than 0, i.e. specified datetime is still in the future.');
    }
  }
  doRefresh(refresher) {
    console.log('Refresh operation');
    this.counter = 0;
    this.restProvider.getUserAnnouncement(this.oaid, this.counter).then((result: any) => {
      console.log("refresh result  " + result);
      if (result == null) {
        this.noticeList = null;
        refresher.complete();
      } else {
        // to make sure UI view is updatinig
        // this.zone.run(() => {
        this.isFull = [];
        this.noticeList = result;
        for (let i = 0; i < this.noticeList.length; i++) {
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
      this.restProvider.getUserAnnouncement(this.oaid, this.counter).then((result: any) => {
        console.log(result.results);
        if (result == null) {
          // resolve();
        } else {
          // to make sure UI view is updatinig
          // this.zone.run(() => {
          this.temp = result;
          for (let i = 0; i < this.temp.length; i++) {
            this.isFull.push(false);
            let x = this.process(this.temp[i]);
            this.temp[i].createdDate = this.calcElapsed(this.temp[i].createdDate);
            this.noticeList.push(x);
          }
          // });
          console.log(this.noticeList);
          this.enableDynamicHyperlinks();
          // resolve();
        }

      }, (err) => {
        console.log(err);
        this.showAlert();
      });
    })
  }
  process(list) {
    for (let i = 0; i < list.mtAnnouncementUploadList.length; i++) {
      if (list.mtAnnouncementUploadList[i].filetype === 'video') {
        console.log('yes');
        let file = list.mtAnnouncementUploadList[i].filepath;
        let base = file.substring(file.lastIndexOf('.'), 0);
        console.log(base);
        list.mtAnnouncementUploadList[i].thumbnail = base;

      } else if (list.mtAnnouncementUploadList[i].filetype === 'image') {
        list.mtAnnouncementUploadList[i].thumbnail = null;
      }
    }
    if (list.programStart != null) {
      list.programStart = this.customPickerOptions(new Date(list.programStart), 'ddd, MMM DD/YY') + " AT " + this.customPickerOptions(new Date(list.programStart), 'hh:mm A');
      list.programEnd = this.customPickerOptions(new Date(list.programEnd), 'ddd, MMM DD/YY') + " AT " + this.customPickerOptions(new Date(list.programEnd), 'hh:mm A');
    }
    return list;
  }
  processDate(date) {
    console.log(date);
    let x = toString().substring(toString.length - 2, 0);
    let x1 = x[0] + x[1];
    console.log('x1 ', x1);
    let x2 = this.customPickerOptions(new Date(x1), 'DD MMM, YYYY HH:mm');
    console.log('x2 ', x2);
    let x3 = new Date(x1).toISOString();
    console.log('x3 ', x3);
    return this.customPickerOptions(new Date(x3));
  }
  calendarDate(date) {
    console.log(date);
    let x = date.split("AT");
    let x1 = x[0] + x[1];
    let x2 = this.customPickerOptions(new Date(x1), 'DD MMM, YYYY HH:mm');
    return new Date(x2);
  }
  enableDynamicHyperlinks() {
    // Provide a minor delay to allow the HTML to be rendered and 'found'
    // within the view template
    setTimeout(() => {
      // Query the DOM to find ALL occurrences of the <a> hyperlink tag
      //  const urls : any    = this._element.nativeElement.querySelectorAll('a');

      // Iterate through these
      URL.createObjectURL((url) => {
        // Listen for a click event on each hyperlink found
        url.addEventListener('click', (event) => {
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
  launchInAppBrowser(link) {
    let opts: string = "location=yes,clearcache=yes,hidespinner=no"
    this.iab.create(link, '_blank', opts);
  }
  launch(location) {
    let options = { timeout: 10000, enableHighAccuracy: true };
    this.geolocation.getCurrentPosition(options).then((pos) => {
      console.log(pos.coords.latitude, pos.coords.longitude);
      let options: LaunchNavigatorOptions = {
        start: [pos.coords.latitude, pos.coords.longitude],
      };

      this.launchNavigator.navigate(location, options).then(
        success => console.log('Launched navigator'),
        error => {
          console.log('Error launching navigator', error);
          const alert = this.alertCtrl.create({
            Headers: 'Error',
            subHeader: 'Please install navigation app.',
            buttons: ['OK']
          });
          alert.present();
        });
    }).catch((error) => {
      console.log('Error getting location', error);
      const alert = this.alertCtrl.create({
        Headers: 'Error',
        subHeader: 'Could not get current location.',
        buttons: ['OK']
      });
      alert.present();
    });
  }
  updateRSVP(i) {
    this.loadingProvider.setupLoading();
    this.restProvider.updateRSVP(this.noticeList[i].eiId, 'Y').then((result: any) => {
      console.log(result);
      this.noticeList[i].attendance = result.status;
      this.loadingProvider.closeLoading();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.showAlert();
    });
  }

  share(i) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.translate.instant('Community Share'),
          icon: !this.platform.is('ios') ? 'share-comm' : null,
          handler: () => {
            this.getOrg(i);
          }
        }, {
          text: this.translate.instant('Facebook share'),
          icon: !this.platform.is('ios') ? 'logo-facebook' : null,
          handler: () => {
            this.facebookShare(i);
          }
        }, {
          text: this.translate.instant('Twitter Share'),
          icon: !this.platform.is('ios') ? 'logo-twitter' : null,
          handler: () => {
            this.twitterShare(i);
          }
        }
        , {
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
  getOrg(i) {
    this.storage.get('defaultProfile').then((val: any) => {
      console.log("val", val)
      this.profilePictUrl = val
    })
    this.loadingProvider.setupLoading();
    this.restProvider.getOrg(this.oaid).then((result: any) => {
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
  communityShare(index) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Select Community');
    for (let i = 0; i < this.orgs.length; i++) {
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
        if (data != undefined) {
          console.log(data);
          //this.shareAnnouncement(index,data);
        }
      }
    });
    alert.present();
  }
  //Note that a lot of apps support sharing multiple files, but Twitter just doesn't accept more that one file.
  twitterShare(i) {
    this.loadingProvider.setupRedirect();
    var img = null;
    if (this.noticeList[i].mtAnnouncementUploadList.length > 0) {
      img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
    }
    var msg = 'Shared via MyJiran App http://www.myjiran.my \n' +
      this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n' +
      this.noticeList[i].title + '\n' +
      this.noticeList[i].notes;

    if (this.noticeList[i].location != null) {
      // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
      msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
    }
    if (this.noticeList[i].programStart != null) {
      msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
    }
    if (this.noticeList[i].programEnd != null) {
      msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
    }
    this.socialSharing.shareViaTwitter(msg, img, null)
      .then((result) => {
        console.log("Share Success", result);
        this.loadingProvider.closeRedirect();
      })
      .catch((err) => {
        console.log("Share Fail", JSON.stringify(err));
        this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          title: 'Share Fail!',
          subTitle: 'Please download Twitter App to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
  }
  //you can prompt the user to paste the message you've passed to the plugin because we're adding it to the clipboard for you.
  facebookShare(i) {
    this.loadingProvider.setupRedirect();
    var img = null;
    if (this.noticeList[i].mtAnnouncementUploadList.length > 0) {
      img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
    }
    var msg = 'Shared via MyJiran App http://www.myjiran.my \n' +
      this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n' +
      this.noticeList[i].title + '\n' +
      this.noticeList[i].notes;

    if (this.noticeList[i].location != null) {
      // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
      msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
    }
    if (this.noticeList[i].programStart != null) {
      msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
    }
    if (this.noticeList[i].programEnd != null) {
      msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
    }
    //sharing a message is not possible.
    //You can share either a link or an image (not both), but a description can not be prefilled.
    this.socialSharing.shareViaFacebookWithPasteMessageHint(msg, img, null, 'Please paste message from your cilpboard')
      .then((result) => {
        console.log("Share Success", result);
        this.loadingProvider.closeRedirect();
      })
      .catch((err) => {
        console.log("Share Fail", JSON.stringify(err));
        this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          title: 'Share Fail!',
          subTitle: 'Please download Facebook App to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
  }
  whatsapp(i) {
    this.loadingProvider.setupRedirect();
    var img = null;
    if (this.noticeList[i].mtAnnouncementUploadList.length > 0) {
      img = this.noticeList[i].mtAnnouncementUploadList[0].filepath;
    }

    var msg = 'Shared via MyJiran App http://www.myjiran.my \n' +
      this.noticeList[i].hostName + ' from ' + this.noticeList[i].hostOrgName + ' has posted: \n' +
      this.noticeList[i].title + '\n' +
      this.noticeList[i].notes;


    if (this.noticeList[i].location != null) {
      // let url = 'https://maps.google.com/?q=' + this.noticeList[index].location.replace(/ /g,'');
      msg = msg + '\n' + 'location: ' + this.noticeList[i].location;
    }
    if (this.noticeList[i].programStart != null) {
      msg = msg + '\n' + 'start: ' + this.noticeList[i].programStart;
    }
    if (this.noticeList[i].programEnd != null) {
      msg = msg + '\n' + 'end: ' + this.noticeList[i].programEnd;
    }
    this.socialSharing.shareViaWhatsApp(msg, img, null)
      .then((result) => {
        console.log("Share Success", result);
        this.loadingProvider.closeRedirect();
      })
      .catch((err) => {
        console.log("Share Fail", JSON.stringify(err));
        this.loadingProvider.closeRedirect();
        const alert = this.alertCtrl.create({
          Headers: 'Share Fail!',
          subHeader: 'Please download WhatsApp to use this feature.',
          buttons: ['OK']
        });
        alert.present();
      });
  }
  getPermission(i) {
    this.calendar.hasReadWritePermission().then((result: any) => {
      console.log('Has permission?', result);
      if (result == true) {
        this.initCalendar(i);
      } else {
        console.log('no permission');
        this.initCalendar(i);

        // this.calendar.requestReadWritePermission().then((res:any) => {
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
    }, (err) => {
      console.log(err);
      const alert = this.alertCtrl.create({
        Headers: 'Error!',
        subHeader: 'Theres issue during checking calendar Read/Write permission.',
        buttons: ['OK']
      });
      alert.present();
    });
  }
  initCalendar(i) {
    this.loadingProvider.setupSaving();
    var start = this.calendarDate(this.noticeList[i].programStart);
    var end = this.calendarDate(this.noticeList[i].programEnd);

    this.calendar.createEvent(this.noticeList[i].title, this.noticeList[i].location, this.noticeList[i].notes, start, end).then((result) => {
      this.loadingProvider.closeSaving();
      const alert = this.alertCtrl.create({
        Headers: 'Sucessful',
        subHeader: 'Event has been saved to your calendar.',
        buttons: ['OK']
      });
      alert.present();
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeSaving();
      if (err === "Please allow access to the Calendar and try again.") {
        const alert = this.alertCtrl.create({
          Headers: 'Oops!',
          subHeader: 'Please allow access to the Calendar and try again.',
          buttons: ['OK']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          Headers: 'Oops!',
          subHeader: 'Theres issue during saving process in calendar.',
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }
  shareAnnouncement(i, org) {
    this.loadingProvider.setupSharing();
    this.secureURL = [];
    if (this.noticeList[i].mtAnnouncementUploadList.length > 0) {
      for (let x = 0; x < this.noticeList[i].mtAnnouncementUploadList.length; x++) {
        let con = {
          filetype: this.noticeList[i].mtAnnouncementUploadList[x].filetype,
          filepath: this.noticeList[i].mtAnnouncementUploadList[x].filepath
        };
        this.secureURL.push(con);
      }
    }

    if (this.noticeList[i].paramType == 'PE') {
      var start = this.processDate(this.noticeList[i].programStart);
      var end = this.processDate(this.noticeList[i].programEnd);
    } else {
      var start = this.noticeList[i].programStart;
      var end = this.noticeList[i].programEnd;
    }

    if (this.noticeList[i].privateEvent == 'Y') {
      var privateState = true;
    } else {
      var privateState = false;
    }
    console.log(this.restParam, "this.restParam")
    this.restParam = {
      personId: org.personId, //sharer id
      referFrom: this.noticeList[i].personId,
      hostId: this.noticeList[i].hostId, //original poster
      orgId: org.orgId,
      title: this.noticeList[i].title,
      notes: this.noticeList[i].notes,
      programStart: start,
      programEnd: end,
      location: this.noticeList[i].location,
      duration: 3,
      subModule: "NB",
      paramType: this.noticeList[i].paramType,
      mtAnnouncementUpload: this.secureURL,
      orgName: this.noticeList[i].hostOrgName,
      orgLogo: this.noticeList[i].orgLogo,
      privateEvent: privateState,
      rsvp: false,
      invitee: []
    };

    console.log('restParam', this.restParam)
    this.loadingProvider.presentLoading();
    const formData: FormData = new FormData();
    formData.append('params', new Blob([JSON.stringify(this.restParam)], {
      type: "application/json"
    }));
    this.restProvider.createAnnouncement(this.restParam).then((result: any) => {
      console.log('getAnnouncementcreate', result);
      this.loadingProvider.closeSharing();
    }, (err) => {
      this.loadingProvider.closeLoading();
      console.log(err);
      this.loadingProvider.closeSharing();
      this.showAlert();
    });
  }


}

