import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ImageProvider } from 'src/providers/image.provider';



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  navParam: any;
  profile: any; //first declare
  isNewUser: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private imageProvider: ImageProvider,
  ) { }

  ionViewWillEnter() {
    this.storage.get('isNewUser').then((val:any) => {   //untuk guna storage
      console.log("val",val)
      this.isNewUser= val
    })
    this.getProfile()
  }

  ngOnInit() {
    //this.getOrg()  //this one boleh take data from previos page
    // this.storage.get('isNewUser').then((val:any) => {   //untuk guna storage
    //   console.log("val",val)
    //   this.isNewUser= val
    // })
    // this.route.queryParams.subscribe(params => {      //get data from previous page
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.navParam = this.router.getCurrentNavigation().extras.state.user;
    //     console.log('navParam',this.navParam)
    //   }
    // });

  }

  getProfile(){
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
    this.router.navigate(['edit-profile'], navigationExtras);  //navigate ke page lain
  }



}
