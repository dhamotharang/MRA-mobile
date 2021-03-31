import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  private projectList;

  constructor(
    private router: Router,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider
  ) { }

  ngOnInit() {
    this.getListProjects();
  }

  navNextPage(data) {
    console.log('navNextPage',data)
    let navigationExtras: NavigationExtras = {
      state: {
        user: data
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
