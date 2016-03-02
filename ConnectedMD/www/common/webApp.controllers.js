/*jshint esnext: true */
"use strict";

import mainController from "/common/main.js";
//-- dashboards
import dashboardSelectController from "/dashboard/dashboard-select.js";
import businessController from "/dashboard/business.js";
import homeOrganizerController from "/dashboard/home-organizer.js";
import stickyNotesController from "/dashboard/sticky-notes.js";
import pclDashboardController from "/dashboard/pcl.js";
//-- timeline
import timelineController from "/timeline/timeline.js";
import styleGuideController from "/style-guide/style-guide.js";
import userProfileController from "/users/profile/user-profile.js";
import addUserController from "/users/add/add-user.js";
import inviteUserController from "/users/invite/invite-user.js";
import manageUsersController from "/users/manage/list.js";
import importController from "/documents/import/add.js";
import companyProfileController from "/company/profile/company-profile.js";
import documentController from "/documents/view/document.js";
import switchCompanyController from "/company/switch/switch-company.js";
import manageGroupsController from "/groups/manage/group-list.js";
import portalStateBankController from "/portal/state-bank/application.js";

angular.module("webApp.controllers", [])
    .controller("webApp.mainController", mainController)
    //-- dashboards
    .controller("webApp.dashboardSelectController", dashboardSelectController)
    .controller("webApp.businessController", businessController)
    .controller("webApp.homeOrganizerController", homeOrganizerController)
    .controller("webApp.stickyNotesController", stickyNotesController)
    .controller("webApp.pclDashboardController", pclDashboardController)
    //-- common controllers
    .controller("webApp.timelineController", timelineController)
    .controller("webApp.styleGuideController", styleGuideController)
    .controller("webApp.userProfileController", userProfileController)
    .controller("webApp.addUserController", addUserController)
    .controller("webApp.inviteUserController", inviteUserController)
    .controller("webApp.manageUsersController", manageUsersController)
    .controller("webApp.importController", importController)
    .controller("webApp.companyProfileController", companyProfileController)
    .controller("webApp.documentController", documentController)
    .controller("webApp.switchCompanyController", switchCompanyController)
    .controller("webApp.manageGroupsController", manageGroupsController)
    .controller("webApp.portalStateBankController", portalStateBankController)
;

export default "webApp.controllers";