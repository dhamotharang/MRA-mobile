import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  private projectList;
  private navParam: any;
  private role: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.action;
        this.role = this.router.getCurrentNavigation().extras.state.role;
        console.log('navParam',this.navParam,this.role)
      }
    });
    if (this.navParam == 'join') {
      this.getListProjects();
    }
    else {
      if (this.role == 'staff') {
        this.getListProjects(); //for staff flow
      }
      else {
        this.getVolunteerInvolved();
      }

    }
 
  }

  navNextPage(data) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data,
        action: this.navParam,
        role: this.role
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }

  getListProjects() {
    this.loadingProvider.presentLoading();
    this.storage.get('personOrgs').then((val:any) => {
    this.restProvider.getProjectList(val.orgId).then((result:any) => {
      console.log('getListProjects',result);
      this.projectList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      console.log('getListProjects err',err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  })
  }

  getVolunteerInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.getProjectInvolvedList(val).then((result:any) => {
        console.log('getProjectInvolved',result);
        this.projectList = result;
        this.loadingProvider.closeLoading();
      }, (err) => {
        this.loadingProvider.closeLoading();
        console.log('getProjectInvolved err',err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });
  })
}


}
