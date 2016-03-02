/*jshint esnext: true */
"use strict";
const HTTP = new WeakMap();
const baseAPI = "<%=API%>";

class webAppService {
   constructor($http) {
      console.log("Construct Weakmap Service");
      this.config = { headers: {
         "token": getCookie("TOKEN"),
         "Access-Control-Allow-Credentials": "True",
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
         "Access-Control-Max-Age": 86400
      }};
      HTTP.set(this, $http);
      this.lookups = {usStates: []};
      //-- preload data
      this.usStates();
      this.getCurrentUser().then( result => {
         window.user = result.data;
      });
   }
   
   usStates() {
      if (this.lookups.usStates.length <= 0) {
         return this.getLookups({type:"us-states"}).then( result => { 
            this.lookups.usStates = result.data;
            return this.lookups.usStates;
         });
      } else {
         return this.lookups.usStates;
    }
   }
   
   error(result) {
      if (result.status === 0) {
         //-- redirect to login when api rejects token
         //document.location.href = "/login-static/login.html";
      }
   }
   
   redirectToLogin() {
      createCookie("TOKEN", "", -1);
      document.location.href = "/";
   }
   
   checkSession(result) {
      if (!result) {
         //this.redirectToLogin();
      } else if (!result.data) {
         //this.redirectToLogin();
      } else if (result.data.error === "session expired") {
         this.redirectToLogin();
      }
      return result;
   }
   
   //-- preload
   getLookups(params) { return HTTP.get(this).post(baseAPI + "lookups", params, this.config).then(result => this.checkSession(result), result => this.checkSession(result)); }
   getCurrentUser() { return HTTP.get(this).post(baseAPI + "currentUser", {}, this.config).then(result => this.checkSession(result), result => this.checkSession(result)); }
   
   //-- users
   getUser(params) { return HTTP.get(this).post(baseAPI + "userProfile", params, this.config).then(result => this.checkSession(result), result => this.checkSession(result)); }
   saveUserProfile(params){ return HTTP.get(this).put(baseAPI + "userProfile", params, this.config).then(result => this.checkSession(result), result => this.checkSession(result)); }
   
   
   static webAppFactory($http) { return new webAppService($http); }
}

webAppService.webAppFactory.$inject = ["$http"];
angular.module("webApp.services", []).factory('webAppSvc', webAppService.webAppFactory);
export default "webApp.services";
