import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  navParam: any;
  fromPage: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cacheHandlerProvider: CacheHandlerProvider,
    private navCtrl: NavController,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }
  policy(){
    const browser = this.iab.create('http://www.oas.my/myjiran/privacypolicy.html','_blank');
  }

  terms(){
    const browser = this.iab.create('http://www.oas.my/myjiran/termsofuse.html');

    
  } 
  navNextPage() {
    let navigationExtras: NavigationExtras = {
      state: {
     user:this.navParam,
     from:this.fromPage
      }
    };
    this.router.navigate(['user-account'], navigationExtras);
  }
 
  
  async Logout() {
    console.log('Logout');
    this.cacheHandlerProvider.clearLocalData()
    this.navCtrl.navigateRoot('/launch');
    const googleUser = await Plugins.GoogleAuth.signOut();
  }

}
