import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { RestProvider } from 'src/providers/rest/rest';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.page.html',
  styleUrls: ['./project-list.page.scss'],
})
export class ProjectListPage implements OnInit {
  private projectList = [
    {project_name: 'Third Wave Covid-19 Emergency',project_image: 'assets/covid-img.jpg'},
    {project_name: 'Gaza Winter Warming Aid',project_image: 'assets/gaza-img.jpg'}
  ]

  constructor(
    private router: Router,
    private restProvider: RestProvider
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
    this.restProvider.getProjectList(320).then((result:any) => {
      console.log('getListProjects',result);
      // this.donateList = result;
      // to make sure UI view is updatinig
      // this.zone.run(() => {
      // for(let i=0; i<result.length; i++){
      //   this.isDonateShown.push(false);
      // }
      // this.loadingProvider.closeLoading();
      // });
    }, (err) => {
      // console.log(err);
      // this.loadingProvider.closeLoading();
      // this.showAlert();
    });
  }

}
