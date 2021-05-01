import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile: any; //first declare

  constructor(
    private iab: InAppBrowser,
    private storage: Storage,
    private router: Router
  ) { }

  ngOnInit() {
    this.getOrg()
  }

  terms(){
    const browser = this.iab.create('http://www.oas.my/myjiran/termsofuse.html');

  }

  getOrg(){
    // this.loadingProvider.presentLoading();
    this.storage.get('defaultProfile').then((val:any) => {   //untuk guna storage
      console.log("val",val)
      this.profile= val
    })

  }

  navigateNextPage() {     //passing data ke page lain
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.profile
      }
    };
    this.router.navigate(['my-account'], navigationExtras);
  }

  // async Logout() {
  //   console.log('Logout');
  //   this.cacheHandlerProvider.clearLocalData()
  //   this.navCtrl.navigateRoot('/launch');
  //   const googleUser = await Plugins.GoogleAuth.signOut();
  // }

}
