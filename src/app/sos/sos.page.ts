import { Component, OnInit } from '@angular/core';
import { CallNumberProvider } from 'src/providers/call-number.provider';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
})
export class SosPage implements OnInit {
  private contactList = [
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'}
  ]

  constructor(
    private callNumberProvider: CallNumberProvider,
  ) { }

  ngOnInit() {
  }


  callFx() {
    let phoneNumber = '0174164546';
    this.callNumberProvider.dialingFx(phoneNumber)
  }

}

