import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { IonSlides } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;
  data: any;
  projectList = [];
  role: any;
  fee: any;
  profile: any;
  fcmToken: any;
  greet: string;
  // projectsInvited: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private storage: Storage,
    private cacheHandlerProvider: CacheHandlerProvider,
    private zone: NgZone
  ) {}

  option = {
    slidesPerView: 2.5,
    spaceBetween: 10,
  };

  ngOnInit() {
    this.storage.get('defaultProfile').then((val:any) => {this.profile = val})
    this.storage.get('provider').then((val:any) => { this.data = val})
    this.storage.get('role').then((val:any) => { this.role = val})
    this.storage.get('personOrgList').then((val:any) => { this.fee = val})  //fee in each org
    this.storage.get('fcmToken').then((val:any) => { this.fcmToken = val})
    this.checkHour()
    // this.getProjectInvolved();
  }

  ionViewWillEnter() {
    if (this.role == 'staff') {
      this.getStaffInvolved();
      this.checkUpdTokenStaff();
    }
    else {
      this.getVolunteerInvolved();
      this.checkUpdTokenVol();
    }
  }

  getStaffInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getStaffProjectList(val).then((result:any) => {
        console.log('getListProjects',result);
        // let p = result.filter(x => x.joinStatus == 'A')
        this.projectList = result;
        this.cacheHandlerProvider.projectInvolved = this.projectList;
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
          let projectsInvited = []
          let p = result.filter(x => x.joinStatus == 'A')
          this.projectList = p;
          this.cacheHandlerProvider.projectInvolved = this.projectList;
          projectsInvited = result.filter(x => x.joinStatus == 'I')
          this.cacheHandlerProvider.projectsInvited = projectsInvited;  //save to service to used in other page
          // this.storage.set('projectsInvited', this.projectsInvited);
          this.loadingProvider.closeLoading();
        }, (err) => {
          this.loadingProvider.closeLoading();
          // console.log(err);
          // this.loadingProvider.closeLoading();
          // this.showAlert();
        });
      });
  }

  checkHour(){
    var myDate = new Date();
    var hrs = myDate.getHours();

    if (hrs < 12){
        this.greet = 'Good Morning';
    }else if (hrs >= 12 && hrs <= 17){
        this.greet = 'Good Afternoon';
    }else if (hrs >= 17 && hrs <= 24){
        this.greet = 'Good Evening';
    }
    this.zone.run(() => {
      this.greet = this.greet.replace('Good', " ");
      console.log(this.greet);
    });
  }

  navNextPage(action) {
    console.log('navNextPage',action)
    let navigationExtras: NavigationExtras = {
      state: {
        action: action,
        role: this.role
      }
    };
    this.router.navigate(['project-list'], navigationExtras);
  }

  navProjectDetail(data,action) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data,
        action: action,
        role: this.role
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }

  navPaymentHistory() {
    let navigationExtras: NavigationExtras = {
      state: {
        fee: this.fee
      }
    };
    this.router.navigate(['payment-history'], navigationExtras);
  }

  navQRCode() {
    let navigationExtras: NavigationExtras = {
      state: {
        projectInvolved: this.projectList
      }
    };
    this.router.navigate(['scan-qr'], navigationExtras);
  }

  checkUpdTokenStaff() {
    if (Capacitor.platform !== 'web' && this.fcmToken != null) {
      let p = []
      this.restProvider.getTokenStaff(320).then((res: any) => {
        console.log('checkUpdTokenStaff',res);
        p = res.filter(x => x.personId == this.profile.personId)
        console.log(p.length);
        if (p.length != 0) {
          this.updateToken(p[0]);
        }
        else {
          this.createToken();
        }
      }).catch(error => {
        console.log(error);
        // this.showAlert();
        // this.loadingProvider.closeSaving();
      })
    }

  }

  checkUpdTokenVol() {
    if (Capacitor.platform !== 'web' && this.fcmToken != null) {
      let p = []
      this.restProvider.getTokenNoti(320).then((res: any) => {
        console.log('checkUpdTokenVol',res);
        p = res.filter(x => x.personId == this.profile.personId)
        console.log(p.length);
        if (p.length != 0) {
          this.updateToken(p[0]);
        }
        else {
          this.createToken();
        }
      }).catch(error => {
        console.log(error);
        // this.showAlert();
        // this.loadingProvider.closeSaving();
      })
    }
  }

  updateToken(data) {
    this.storage.get('fcmToken').then((val:any) => {
      console.log('createToken',val)
      let param = {
        platform: 'android',
        oaId: this.profile.oaId,
        token: val,
        id: data.id,
        // personId: this.profile.personId
      }
      this.restProvider.updateToken(param).then((result:any) => {
        console.log('updateToken',result);
      }, (err) => {
        console.log(err);
      });
    });

  }

  createToken() {
    let data = {
      platform: 'android',
      oaId: this.profile.oaId,
      token: this.fcmToken,
      personId: this.profile.personId
    }
    this.restProvider.createToken(data).then((result:any) => {
      console.log('createToken',result);
    }, (err) => {
    });


  }

  navSos(){
    this.router.navigate(['sos']);
  }


}
