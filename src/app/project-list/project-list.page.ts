import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  private projectList;
  navParam: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {      //get data from previous page
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParam = this.router.getCurrentNavigation().extras.state.action;
        console.log('navParam',this.navParam)
      }
    });
    this.getListProjects();
  }

  navNextPage(data) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data,
        action: this.navParam
      }
    };
    this.router.navigate(['project-detail'], navigationExtras);
  }

  getListProjects() {
    this.loadingProvider.presentLoading();
    this.restProvider.getProjectList(320).then((result:any) => {
      console.log('getListProjects',result);
      this.projectList = result;
      this.loadingProvider.closeLoading();
    }, (err) => {
      this.loadingProvider.closeLoading();
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

}
