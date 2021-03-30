import { Component, OnInit } from '@angular/core';
import { RestProvider } from 'src/providers/rest/rest';

@Component({
  selector: 'app-events-tabbar',
  templateUrl: './events-tabbar.page.html',
  styleUrls: ['./events-tabbar.page.scss'],
})
export class EventsTabbarPage implements OnInit {

  constructor(
    private restProvider: RestProvider
  ) { }

  ngOnInit() {
  }

}
