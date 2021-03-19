import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.page.html',
  styleUrls: ['./scan-qr.page.scss'],
})
export class ScanQrPage implements OnInit {

  constructor(
    private barcodeScanner: BarcodeScanner,
    private router: Router
  ) { }

  ngOnInit() {
    this.scan();
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.navigate();
    }).catch(err => {
      console.log('Error', err);
    });
  }


  navigate(){
    this.router.navigate(['/home'])
  }

}
