import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { CacheHandlerProvider } from 'src/providers/cache-handler.provider';
import { NavController, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Storage } from '@ionic/storage-angular';
import { ImageProvider } from 'src/providers/image.provider';
import { LogoutProvider } from 'src/providers/logout-provider';
import { AlertProvider } from 'src/providers/alert-provider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  
  navParam: any;
  fromPage: any;
  profile: any; //first declare


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private cacheHandlerProvider: CacheHandlerProvider,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private storage: Storage,
    private imageProvider: ImageProvider,
    private alertCtrl: AlertController,
    private logoutProvider: LogoutProvider,
    private alertProvider: AlertProvider
  ) { }

  ngOnInit() {
    this.getOrg()
  }
  policy(){
    const browser = this.iab.create('http://www.oas.my/myjiran/privacypolicy.html','_blank');
  }

  terms(){
    const browser = this.iab.create('http://www.oas.my/myjiran/termsofuse.html');

    
  } 
  // navNextPage() {
  //   let navigationExtras: NavigationExtras = {
  //     state: {
  //    user:this.navParam,
  //    from:this.fromPage
  //     }
  //   };
  //   this.router.navigate(['user-account'], navigationExtras);
  // }
 
  
  async Logout() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Log Out',
      subHeader: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: data => {
            this.logoutProvider.logoutGoogle().then((res:any) => {
              this.router.navigateByUrl('/launch');
              console.log('success logut')
            },(err) => {
              this.alertProvider
            });
          }
        }
      ]
    });
    await alert.present();
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

}
