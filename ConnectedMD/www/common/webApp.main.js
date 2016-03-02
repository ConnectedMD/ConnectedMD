/* jshint esnext: true */
"use strict";
import { default as controllersModules } from '/common/webApp.controllers.js';
import { default as servicesModules } from '/common/webApp.services.js';
window.user = [];
window.company = [];
window.directory = [];
window.lookups = [];

function config($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise(function() { document.location.href = "/"; } );
  $stateProvider
    .state("home", { url: "/", templateUrl: "/index.html",
      views: {
        "header": { templateUrl: "/common/main.html", controller:"webApp.mainController", controllerAs:"mainCtrl" },
        "@": { }
      }
    })
    //-- dashboard routes
    .state("dashboard", { parent: "home", url: "/dashboard/select",
      views: { "@": { templateUrl: "/dashboard/dashboard-select.html", controller:"webApp.dashboardSelectController", controllerAs:"dashboardSelectCtrl" } }
    })
    .state("business", { parent: "home", url: "/dashboard/business",
      views: { "@": { templateUrl: "/dashboard/business.html", controller:"webApp.businessController", controllerAs:"businessCtrl" } }
    })
    .state("homeOrganizer", { parent: "home", url: "/dashboard/home-organizer",
      views: { "@": { templateUrl: "/dashboard/home-organizer.html", controller:"webApp.homeOrganizerController", controllerAs:"homeOrgCtrl" } }
    })
    .state("sticky-notes", { parent: "home", url: "/dashboard/sticky-notes",
      views: { "@": { templateUrl: "/dashboard/sticky-notes.html", controller:"webApp.stickyNotesController", controllerAs:"stickyNotesCtrl" } }
    })
    .state("pcl-dashboard", { parent: "home", url: "/dashboard/pcl-dashboard",
      views: { "@": { templateUrl: "/dashboard/pcl.html", controller:"webApp.pclDashboardController", controllerAs:"pclCtrl" } }
    })
    //-- timeline route
    .state("timeline", { parent: "home", url: "/timeline",
      views: { "@": { templateUrl: "/timeline/timeline.html", controller:"webApp.timelineController", controllerAs:"timelineCtrl" } }
    })
    //-- user routes
    .state("userProfile", { parent: "home", url: "/users/profile",
      views: { "@": { templateUrl: "/users/profile/user-profile.html", controller:"webApp.userProfileController", controllerAs:"userProfileCtrl" } }
    })
  ;
}

function init() {
    /* only fires once at the start of the app */
    console.log("INIT APP");
    window.fitViewport(); // init sizing
    
}

config.$inject = ["$locationProvider", "$stateProvider", "$urlRouterProvider"];

var app = angular
  .module("webApp", ["ngMessages", "ui.router", "ngFileUpload", "ui.bootstrap", servicesModules, controllersModules, directivesModules])
  .config(config)
  .run(function () { init(); })
;

export default "webApp";