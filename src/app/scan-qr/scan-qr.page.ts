import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {
  projectDetail: any;
  projectInvolved: any;
  projId: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    private storage: Storage,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('ngOnInit',params) 
      if (this.router.getCurrentNavigation().extras.state) {
        this.projectInvolved = this.router.getCurrentNavigation().extras.state.projectInvolved;
        console.log('projectInvolved',this.projectInvolved)
      }
    });
    
    this.scan();
  }

  scan() {
    let p = [];
    this.barcodeScanner.scan().then(projId => {
      p = this.projectInvolved.filter(x => x.projId == projId)
      if (p.length != 0) {
        alert('You have not joined this project!')
      }
      else {
        this.projId = projId
        this.sendAttendance()
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  sendAttendance() {
    this.storage.get('defaultPersonId').then((val:any) => {
      this.restProvider.attendProject(val, this.projId).then((result:any) => {
        console.log('sendAttendance',result);
        // this.projectDetail = result;
        // this.loadingProvider.closeLoading();
        // this.navCtrl.back();
      }, (err) => {
        // console.log(err);
        // this.loadingProvider.closeLoading();
        // this.showAlert();
      });
    });
    this.navigate();
  }


  navigate(){
    this.router.navigate(['/home'])
  }

}
