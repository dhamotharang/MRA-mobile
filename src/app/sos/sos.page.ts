import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
    private router: Router,
    private callNumberProvider: CallNumberProvider,
  ) { }

  ngOnInit() {
  }


  callFx() {
    let phoneNumber = '0174164546';
    this.callNumberProvider.dialingFx(phoneNumber)
  }

  navigateNextPage() {     //passing data ke page lain
    let navigationExtras: NavigationExtras = {
      state: {
      }
    };
    this.router.navigate(['contact-list'], navigationExtras);  //navigate ke page lain
  }

}

