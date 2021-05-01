import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage-angular';



@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  navParam: any;
  profile: any; //first declare

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage
  ) { }

  ngOnInit() {
    //this.getOrg()  //this one boleh take data from previos page
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.user;
        console.log('navParam',this.navParam)
      }
    });
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
    this.router.navigate(['edit-profile'], navigationExtras);  //navigate ke page lain
  }



}
