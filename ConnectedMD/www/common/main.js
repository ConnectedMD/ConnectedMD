/*jshint esnext: true */
"use strict";
const SERVICE = new WeakMap();

class mainController {

   constructor(webAppSvc, $state) {
      console.log("START Main");
      SERVICE.set(this, webAppSvc);
      this.userProfile = [];
      this.companyProfile = [];
      this.uiState = $state;
      this.init();
   }
   
   init() {
      this.companyInfo();
      this.userInfo();
   }
   
   logout() {
      createCookie("TOKEN", 0, -1);
      document.location.href="/";
   }
   
   chat() {
      alert("Comming Soon");
   }
   
   defaultDashboard() {
      this.uiState.go(this.companyProfile.dashboard);
   }
   
   switchDashboard(dashboard) {
      console.log("Load " + dashboard + " dashboard");
		SERVICE.get(this).saveCompanyProfile({dashboard: dashboard}).then(result => {
         this.uiState.go(dashboard);
		});
      
   }
   
   userInfo() {
		SERVICE.get(this).getUser({action:"currentUser"}).then( result => {
			this.userProfile = result.data;
		});
   }

   companyInfo() {
		SERVICE.get(this).getCompanyProfile({}).then( result => {
			this.companyProfile = result.data;
         //-- load default dashboard
         if (this.companyProfile.dashboard) {
            this.uiState.go(this.companyProfile.dashboard);
         } else {
            this.uiState.go("dashboard");
         }
		});
   }
   
}

mainController.$inject = ["webAppSvc", "$state"];

export default mainController;
