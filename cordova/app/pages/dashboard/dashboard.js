import {Page, NavController, NavParams} from 'ionic-angular';

@Page({
  templateUrl: 'build/pages/dashboard/dashboard.html'
})

export class DashboardPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }
  
  constructor(nav, navParams) {
    this.nav = nav;
    this.tabs = [
      { name: 'Activity', index: 0, iconClass:'pe-7s-hourglass', active:true},
      { name: 'Appointments', index: 1, iconClass:'pe-7s-clock', active:false },
      { name: 'Forms', index: 2, iconClass:'pe-7s-note2', active:false }
    ]

    this.slideOptions = {
      spaceBetween: 0
    };
    
    //test data
    this.content = {
      activities:[
        { 
          id: '0',
          title: 'Form Sent',
          description: 'Sent completed Onboarding form to Bergstein & Associates',
          time: new Date(2016, 3, 17, 9, 0),
        },
        { 
          id: '1',
          title: 'Form Completed',
          description: 'Recieved Onboarding form from Bergstein & Associates',
          time: new Date(2016, 3, 2, 7, 39),
        }
      ],
      appointments:[
        { 
          id:'0', 
          title:'Medical Checkup', 
          practice:'Bergstein & Associates', 
          time: new Date(2016, 3, 17, 17, 30), 
          description:'Appointment with Dr. Bergstein to check Blood Pressure & CT-Scan',
          location: { type:'place', address:'' } 
        },
        { 
          id:'1', 
          title:'Teeth Cleaning', 
          practice:'Delta Dental - Atlanta', 
          time: new Date(2016, 3, 25, 11, 0), 
          description:'Regular dentist visit for routine cleaning',
          location: { type:'place', address:'' } 
        },
        { 
          id:'2', 
          title:'Eye Exam', 
          practice:'Madeline Optical Specialists', 
          time: new Date(2016, 3, 26, 14, 15), 
          description:'Optical exam - prep for Lasic surgery',
          location: { type:'place', address:'' } 
        },
        { 
          id:'3', 
          title:'2 year-old checkup for David', 
          practice:'Kinder & Minder', 
          time: new Date(2016, 4, 15, 9, 30), 
          description:'2-year check up for David. Getting immunization shots and allergy test',
          location: { type:'place', address:'' } 
        },
        { 
          id:'4', 
          title:'Counseling Session', 
          practice:'Dr. Damien Mars', 
          time: new Date(2016, 4, 20, 13, 0), 
          description:'Quaterly counseling session with Dr. Damien',
          location: { type:'video' } 
        },
      ],
      forms:[
        {
          id: '0',
          name: 'onboard_192394',
          title: 'Patient Onboarding',
          recieved: new Date(2016, 3, 2, 0, 15),
          practice:'Bergstein & Associates'
        }
      ]
    }
  }
  
  /* Events */
  onSlideChanged(slides){
    let slider = document.querySelector('.swiper-container').swiper;
    this.tabs.forEach(tab => { tab.active = false; });
    let selectedTab = this.tabs.filter(sel => { return sel.index === slider.activeIndex; });
    if(selectedTab && selectedTab.length > 0 ){ selectedTab[0].active = true; }
  };
  
  setActiveTab(event, item, switchSlide){
    this.tabs.forEach(tab => { tab.active = false; });
    let selectedTab = this.tabs.filter(sel => { return sel.index === item.index; });
    if(selectedTab && selectedTab.length > 0 ){ selectedTab[0].active = true; this.switchSlide(item.index);  }
  };
  
  /* Methods */
  switchSlide(index){
    let slider = document.querySelector('.swiper-container').swiper; //based off of the swiper jquery plugin http://idangero.us/swiper/api/#.VxPN_DArKUk
    slider.slideTo(index);
  };
}
