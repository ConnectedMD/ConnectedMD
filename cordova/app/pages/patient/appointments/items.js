import {Page, NavController, NavParams} from 'ionic-angular';


@Page({
  templateUrl: '/build/pages/patient/appointments/items.html'
})
export class AppointmentItemsPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, navParams) {
    this.nav = nav;
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }
}
