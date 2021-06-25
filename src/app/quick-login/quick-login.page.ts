import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-quick-login',
  templateUrl: './quick-login.page.html',
  styleUrls: ['./quick-login.page.scss'],
})
export class QuickLoginPage implements OnInit {
  param = {
    providerCode: "",
    providerId: "",
    token: "",
    platform:""
  }
  profile: any;
  personOrg: any;
  role: string;


  constructor(
    private googlePlus: GooglePlus,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private storage: Storage,
    private router: Router,

  ) { }

  ngOnInit() {
  }

  async googleSignup() {
    if (Capacitor.platform !== 'web') {
      this.googlePlus.login({}).then((result:any) => {
        console.log('googleSignup',result)
        // alert(result)
        this.loginFx(result)
      })
      .catch(err => console.error(err));
    }
    else {
      this.staff()
    }
  }

  loginFx(data) {
    console.log('loginFx',data)
    this.loadingProvider.presentLoading()
    this.param.providerCode = "google";
    this.param.providerId = data.email;
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile()
  }

  staff() {
    this.loadingProvider.presentLoading()
    this.param.providerCode = "google";
    this.param.providerId = "annas@oas.my";
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile();
  }

  getProfile(){
    // this.loadingProvider.presentLoading();
    this.restProvider.getProfile(this.param).then((result:any) => {
      console.log('getProfile',result);
      this.profile = result
      // this.loadingProvider.closeLoading();
      if(result.personId == null){
        this.storage.set('isNewUser', true);
        this.router.navigate(['profile']);

      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result);
        this.storage.set('nonOrgPersonId', result.personId);  //personId not for org
        this.getOrg();
      }
    }, (err) => {
      console.log('getProfileErr',err);
      // this.loadingProvider.closeLoading();
    });
  }

  getOrg(){ //get org using get fee rest
    // this.loadingProvider.presentLoading();
    this.restProvider.getFee(this.profile.personId).then((result:any) => {
      // this.loadingProvider.closeLoading();
      this.personOrg = result;
      this.filterOrg();
    }, (err) => {
      console.log('getOrg err',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }

  filterOrg() {//hardcoded
    let p = this.personOrg.filter(x => x.orgProfile.module.modId == 6 && x.orgProfile.orgId == 320)
    console.log('p',p)
    if (p.length == 0) {  //for now vol
      this.storage.set('defaultPersonId', this.profile.personId);
      this.storage.set('personOrgs', 320)
    }
    else {
      this.profile.personId = p[0].personId
      this.storage.set('defaultPersonId', p[0].personId);
      this.storage.set('personOrgs', p[0].orgId)
    }
    this.storage.get('defaultProfile').then((val:any) => {
      val.personId = this.profile.personId
      this.storage.set('defaultProfile', val)
    })
    this.checkRole();
  }

  async checkRole() {
    let result = [];
    let ids = ["1","4","5","9"];
    // this.loadingProvider.presentLoading();
    for (let i = 0; i < ids.length; i++) {
      await this.restProvider.checkRole(this.profile.personId, ids[i]).then((data:any) => {
        result.push(data)
        console.log('checkRole',result)
      }, (err) => {
        console.log('checkRoleErr',err);
      });
      // this.loadingProvider.closeLoading();
    }
    let q = result.find(x => x == true);
    console.log('q',q)
    if (q) {
      this.role = 'staff'
    }
    else {
      this.role = 'volunteer'
    }
    this.loadingProvider.closeLoading()
    this.storage.set('role', this.role);
    this.storage.set('fromQuickLogin', true);
    this.navToHome();
  }

  navToHome() {
    this.router.navigate(['payment-history']);
  }

}
