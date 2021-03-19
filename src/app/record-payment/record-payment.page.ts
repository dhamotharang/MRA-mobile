import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-payment',
  templateUrl: './record-payment.page.html',
  styleUrls: ['./record-payment.page.scss'],
})
export class RecordPaymentPage implements OnInit {
  recordList = [
    {project_name: 'Third Wave Covid-19 Emergency',project_image: 'assets/covid-img.jpg',record_name: 'Derma Kilat'},
    {project_name: 'Gaza Winter Warming Aid',project_image: 'assets/gaza-img.jpg',record_name: 'Derma Kilat'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
