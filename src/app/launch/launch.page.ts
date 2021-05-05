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
  role: string;


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
    this.getProfile()
  }

  getProfile(){
    // this.loadingProvider.presentLoading();
    this.restProvider.getProfile(this.param).then((result:any) => {
      console.log('getProfile',result);
      this.profile = result
      // this.loadingProvider.closeLoading();
      if(result.personId == null){
        this.storage.set('isNewUser', true);
      }else{
        this.storage.set('isNewUser', false);
        this.storage.set('defaultProfile', result);
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
    if (p.length == 0) {  //for now vol
      this.storage.set('defaultPersonId', this.profile.personId);
      this.storage.set('personOrgs', 320)
    }
    else {
      this.profile.personId = p[0].personId
      this.storage.set('defaultPersonId', p[0].personId);
      this.storage.set('personOrgs', p[0].orgId)
    }
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
    this.navToHome();
  }


  

  navToHome() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.param,
        role: this.role,
        fee: this.personOrg
      }
    };
    this.router.navigate(['tabs'], navigationExtras);
  }

  
}




  // volunteer() {
  //   this.param.providerCode = "google";
  //   this.param.providerId = "nisahasin95@gmail.com";
  //   this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
  //   this.storage.set('provider', this.param);
  //   this.storage.set('isLoggedIn', true);
  //   this.getProfile('volunteer');
  // }

  // staff() {
  //   this.param.providerCode = "google";
  //   this.param.providerId = "annas@oas.my";
  //   this.storage.set('profilePictUrl', 'https://res.cloudinary.com/myjiran/image/upload/v1541160270/mobile_asset/ion-ios-contact.png');
  //   this.storage.set('provider', this.param);
  //   this.storage.set('isLoggedIn', true);
  //   this.getProfile();
  // }