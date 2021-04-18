import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { NavController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private cacheHandlerProvider: CacheHandlerProvider,
    private navCtrl: NavController,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }

  terms(){
    const browser = this.iab.create('http://www.oas.my/myjiran/termsofuse.html');

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
   });

    browser.close();
  }
  
  async Logout() {
    console.log('Logout');
    this.cacheHandlerProvider.clearLocalData()
    this.navCtrl.navigateRoot('/launch');
    const googleUser = await Plugins.GoogleAuth.signOut();
  }

}
