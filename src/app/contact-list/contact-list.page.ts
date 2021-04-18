import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  private contactList = [
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'},
    {contact_name: 'muhammad ali',contact:'012-3456678'}
  ]

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }


  navFx() {
    this.navCtrl.navigateBack('/sos');
  }

  addContact(data) {
    console.log('addContact',data);
  }

}
