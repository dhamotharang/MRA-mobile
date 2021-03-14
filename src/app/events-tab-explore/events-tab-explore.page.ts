import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events-tab-explore',
  templateUrl: './events-tab-explore.page.html',
  styleUrls: ['./events-tab-explore.page.scss'],
})
export class EventsTabExplorePage implements OnInit {
  constructor() {}

  option = {
    slidesPerView: 1.05,
    spaceBetween: 10,
  };

  ngOnInit() {}
}
