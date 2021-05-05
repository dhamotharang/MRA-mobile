import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  appVersion: any;
  version: any;
  build: any;

  constructor(
    
  ) {    }
  ngOnInit() {
   // this.checkVersion();
  }
  checkVersion(){
    this.appVersion.getVersionNumber().then((res:any) => {
      console.log(res);
      this.version = res;
      this.appVersion.getVersionCode().then((res:any) => {
        console.log(res);
        this.build = res;
      });
    });
  }

}
