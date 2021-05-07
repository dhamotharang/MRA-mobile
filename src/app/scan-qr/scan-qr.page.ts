import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { LoadingProvider } from 'src/providers/loading-provider';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {
  projectDetail: any;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router,
    private storage: Storage,
    private restProvider: RestProvider,
    private loadingProvider: LoadingProvider,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.storage.get('defaultPersonId').then((val:any) => {
        this.restProvider.requestJoin(val, barcodeData).then((result:any) => {
          console.log('getProjectDetail',result);
          this.projectDetail = result;
          this.loadingProvider.closeLoading();
          // this.navCtrl.back();
        }, (err) => {
          // console.log(err);
          this.loadingProvider.closeLoading();
          // this.showAlert();
        });
      });
      this.navigate();
    }).catch(err => {
      console.log('Error', err);
    });
  }


  navigate(){
    this.router.navigate(['/home'])
  }

}
