/// <reference path="../../typings/tsd.d.ts" />

// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

module ConnectedMD {

    class Main {
        constructor() {
            document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
        }

        _onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener('pause', this._onPause.bind(this), false);
            document.addEventListener('resume', this._onResume.bind(this), false);

            this.Start();
        };

        _onPause() {
            ConnectedMD.Core.Dispatcher.dispatch({
                module: ConnectedMD.Core.Actions.Cordova,
                action: ConnectedMD.Core.Actions.CordovaActionType.Pause,
                data: undefined
            });
        };

        _onResume() {
            ConnectedMD.Core.Dispatcher.dispatch({
                module: ConnectedMD.Core.Actions.Cordova,
                action: ConnectedMD.Core.Actions.CordovaActionType.Resume,
                data: undefined
            });
        };

        Start() {
            var routes = new ConnectedMD.Core.Routes.RouteConfig().configureRoutes();

            ReactRouter.run(routes, function (handler) {
                React.render(React.createElement(handler), document.body);
            });
        }
    }

    var currentApp = new Main();
}