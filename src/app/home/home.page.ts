import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingProvider } from 'src/providers/loading-provider';
import { RestProvider } from 'src/providers/rest/rest';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: any;
  projectList = [];
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

  ngOnInit() {   
    this.route.queryParams.subscribe(params => {
      console.log('ngOnInit',params) 
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.user;
        console.log('data',this.data)
      }
    });
    this.getProjectInvolved();
  }

  getProjectInvolved() {
    this.loadingProvider.presentLoading();
    this.storage.get('defaultPersonId').then((val:any) => {
      console.log('defaultPersonId', val);
      this.restProvider.getProjectList(val).then((result:any) => {
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
}
