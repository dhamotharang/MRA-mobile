import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;
  data: any;     //store value from previous page
  projectList = [];
  role: any;  //store value from previous page
  fee: any;   //store value from previous page
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingProvider: LoadingProvider,
    private restProvider: RestProvider,
    private storage: Storage,
  ) {}

  option = {
    slidesPerView: 2.5,
    spaceBetween: 10,
  };

  ngOnInit() {     //take data from previous page
    this.route.queryParams.subscribe(params => {
      console.log('ngOnInit',params)
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        this.fee = this.router.getCurrentNavigation().extras.state.fee;
        console.log('data',this.data)
        console.log('role',this.role)
      }
    });
    // this.getProjectInvolved();
  }

  ionViewWillEnter() {
    // this.route.queryParams.subscribe(params => {
    //   console.log('ngOnInit',params)
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.data = this.router.getCurrentNavigation().extras.state.user;
    //     console.log('data',this.data)
    //   }
    // });
    if (this.role == 'staff') {
      this.getStaffInvolved();
    }
    else {
      this.getVolunteerInvolved();
    }
  }

  getStaffInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getStaffProjectList(val).then((result:any) => {
        console.log('getListProjects',result);
        this.projectList = result;
        this.loadingProvider.closeLoading();
      }, (err) => {
        this.loadingProvider.closeLoading();
        console.log('getListProjects err',err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });

    });

    // this.storage.get('personOrgs').then((val:any) => {
    //   console.log('personOrgs', val);
    //   this.restProvider.getProjectList(val.orgId).then((result:any) => {
    //     console.log('getListProjects',result);
    //     this.projectList = result;
    //     this.loadingProvider.closeLoading();
    //   }, (err) => {
    //     this.loadingProvider.closeLoading();
    //     console.log('getListProjects err',err);
    //     // this.loadingProvider.closeLoading();
    //     // this.showAlert();
    //   });

    // });

  }

  getVolunteerInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
        this.restProvider.getProjectInvolvedList(val).then((result:any) => {
          console.log('getListProjects',result);
          this.projectList = result;
          this.loadingProvider.closeLoading();
        }, (err) => {
          this.loadingProvider.closeLoading();
          // console.log(err);
          // this.loadingProvider.closeLoading();
          // this.showAlert();
        });
      });
  }

  navNextPage(action) {
    console.log('navNextPage',action)
    let navigationExtras: NavigationExtras = {
      state: {
        action: action,
        role: this.role
      }
    };
    this.router.navigate(['project-list'], navigationExtras);
  }

  navProjectDetail(data,action) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data,
        action: action,
        role: this.role
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }

  navPaymentHistory() {
    let navigationExtras: NavigationExtras = {
      state: {
        fee: this.fee
      }
    };
    this.router.navigate(['payment-history'], navigationExtras);
  }

  navSOS() {
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['sos'], navigationExtras);
  }

}
