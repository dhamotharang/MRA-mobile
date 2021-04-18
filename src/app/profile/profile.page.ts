import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  constructor(
    private iab: InAppBrowser) {
    
   }

 
 policy(){
    const browser = this.iab.create('http://www.oas.my/myjiran/privacypolicy.html','_blank');
  }
}