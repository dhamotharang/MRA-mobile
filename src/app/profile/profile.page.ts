import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular/providers/nav-controller';
import { MyAccountPage } from '../my-account/my-account.page';
//import { ProfilePage } from '../my-account/my-account';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  navCtrl: NavController;
  //iab: InAppBrowser;

  constructor(private iab: InAppBrowser) { }

  ngOnInit() {
  }

  terms(){
    const browser = this.iab.create('http://www.oas.my/myjiran/termsofuse.html');

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
   });

    browser.close();
  }

}

// profile(){
//   this.navCtrl.push(ProfilePage);
// }
