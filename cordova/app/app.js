import {App, IonicApp, Platform, MenuController} from 'ionic-angular';
import {ScrollSpyService} from 'ng2-scrollspy';
import {StatusBar} from 'ionic-native';
import {DashboardPage} from './pages/dashboard/dashboard';
import {FormsPage} from './pages/forms/forms';
import {PhysicianLocatorPage} from './pages/physician/locator/search';
import {PatientAppointmentPage} from './pages/patient/appointments/list';
import {VideoPage} from './pages/video/video';

@App({
  templateUrl: 'build/app.html',
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
class MyApp {
  static get parameters() {
    return [[IonicApp], [Platform], [MenuController]];
  }

  constructor(app, platform, menu) {
    // set up our app
    this.app = app;
    this.platform = platform;
    this.menu = menu;
    this.initializeApp();

    // set our app's pages
    // TODO: diffrent menus for doctors and patients
    this.pages = [
      { title: 'Dashboard', component: DashboardPage, params: {}, opt: {}},
      { title: 'Appointments', component: PatientAppointmentPage, params: {}, opt: {} },
      { title: 'Forms', component: FormsPage, params: {}, opt: {} },
      { title: 'Find a Physician', component: PhysicianLocatorPage, params: {}, opt: {} },
      { title: 'Video', component: VideoPage, params: {room: "test"}, opt: {animate:true} }
    ];

    // make dashboard the root (or first) page
    this.rootPage = DashboardPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    let nav = this.app.getComponent('nav');
    //nav.push(page.component, page.params, page.opt );
    nav.setRoot(page.component, page.params, page.opt );
  }
}
