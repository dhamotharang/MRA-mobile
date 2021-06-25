import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AlertProvider } from 'src/providers/alert-provider';

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
    private alertProvider: AlertProvider
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
    this.barcodeScanner.scan().then(data => {
      console.log('scan data',data)
      let projId = Number(data.text)
      p = this.projectInvolved.filter(x => x.projId == projId)
      console.log('p',p)
      if (p.length != 0) {
        this.projId = projId
        this.sendAttendance(p)
      }
      else {
       this.alertProvider.errorAlertParam('Error!','You have not joined this project!')
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  sendAttendance(p) {
    let data = p[0]
    this.loadingProvider.presentLoading();
    this.restProvider.attendProject(data).then((result:any) => {
      console.log('sendAttendance',result);
       this.loadingProvider.closeLoading();
       this.alertProvider.successAlert()
    }, (err) => {
      console.log(err);
      this.loadingProvider.closeLoading();
      this.alertProvider.errorAlert()
    });
    this.navigateBack();
  }


  navigateBack(){
    this.navCtrl.back();
  }

}
