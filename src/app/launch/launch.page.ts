import { Component } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { LoadingProvider } from 'src/providers/loading-provider';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'launch.page.html',
  styleUrls: ['launch.page.scss'],
})
export class LaunchPage {
  param = {
    providerCode: "",
    providerId: "",
    token: "",
    platform:""
  }
  personOrg: any;
  userInfo: any;
  profile: any;


  constructor(
    private restProvider: RestProvider,
    private navCtrl: NavController,
    private router: Router,
    private storage: Storage,
    private loadingProvider: LoadingProvider
  ) {}

  ngOnInit() {
// this.restProvider.appConf1("MBOA")
  }

  async googleSignup() {
    const googleUser = await Plugins.GoogleAuth.signIn();
    console.log('my user: ', googleUser);
    this.loginFx(googleUser)
  }

  loginFx(data) {
    console.log('loginFx',data)
    this.param.providerCode = "google";
    this.param.providerId = data.email;
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    if (this.param.providerId == "nisahasin95@gmail.com") {
      this.getProfile('volunteer');
    }
    else {
      this.getProfile('staff');
    }
  }

  volunteer() {
    this.param.providerCode = "google";
    this.param.providerId = "nisahasin95@gmail.com";
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile('volunteer');
  }

  staff() {
    this.param.providerCode = "google";
    this.param.providerId = "annas@oas.my";
    this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
    this.storage.set('provider', this.param);
    this.storage.set('isLoggedIn', true);
    this.getProfile('staff');
  }

  getProfile(role){
    // this.loadingProvider.presentLoading();
    this.restProvider.getProfile(this.param).then((result:any) => {
      console.log('getProfile',result);
      this.profile = result
      if(result.personId == null){
        this.storage.set('isNewUser', true);
        // this.loadingProvider.closeLoading();
        // this.nav.setRoot(ProfileModal);
      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result);
        this.storage.set('defaultPersonId', result.personId);
        // this.loadingProvider.closeLoading();
        this.getOrg(role);
        // this.checkRole();
      }
    }, (err) => {
      console.log('profilePictUrl',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

  getOrg(role){
    // this.loadingProvider.presentLoading();
    this.restProvider.getFee(this.profile.personId).then((result:any) => {
      // this.loadingProvider.closeLoading();
      // this.storage.set('personOrgs', result);
      this.personOrg = result;
      console.log('getOrg',result)
      this.filterOrg(role);
      // this.nav.setRoot(TabsPage, {opentab: 1});
    }, (err) => {
      console.log('getOrg err',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });

  }
  

  filterOrg(role) {
    let p = this.personOrg.filter(x => x.orgProfile.module.modId == 6 && x.orgProfile.orgId == 320)
    console.log('p',p)
    this.storage.set('personOrgs', p[0]).then((result:any) => {
      this.navToHome(role);
    })

  }

  checkRole() {
    console.log('checkRole')
    let ids = ["1","3","4","5","9","10"];
    for (let i = 0; i < ids.length; i++) {
      this.restProvider.checkRole(this.profile.personId, ids[i]).then((result:any) => {
        console.log('checkRole',result);
      }, (err) => {
        console.log('profilePictUrl',err);
      });
    }
  }

  

  navToHome(role) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.param,
        role: role
      }
    };
    this.router.navigate(['tabs'], navigationExtras);
  }

  
}
