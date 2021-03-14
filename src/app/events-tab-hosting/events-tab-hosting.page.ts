import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-tab-hosting',
  templateUrl: './events-tab-hosting.page.html',
  styleUrls: ['./events-tab-hosting.page.scss'],
})
export class EventsTabHostingPage implements OnInit {
  constructor() {}

  option = {
    slidesPerView: 1.05,
    spaceBetween: 10,
  };

  ngOnInit() {}
}
