import { Component, OnInit } from '@angular/core';

interface Action {
  id: number;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public actions: Action[];

  constructor() {
    this.actions = [
      {
        id: 1,
        title: 'Join Project',
        icon: 'add-outline',
      },
      {
        id: 2,
        title: 'Inventory',
        icon: 'archive-outline',
      },
      {
        id: 3,
        title: 'QR Code',
        icon: 'qr-code-outline',
      },
      {
        id: 4,
        title: 'View Events',
        icon: 'calendar-number-outline',
      },
      {
        id: 5,
        title: 'Payment History',
        icon: 'document-text-outline',
      },
      {
        id: 6,
        title: 'Record Payment',
        icon: 'cash-outline',
      },
    ];
  }

  option = {
    slidesPerView: 2.5,
    // loop: true,
    spaceBetween: 10,
  };

  ngOnInit() {}
}
