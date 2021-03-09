import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  option = {
    slidesPerView: 2.5,
    spaceBetween: 10,
  };

  ngOnInit() {}
}
