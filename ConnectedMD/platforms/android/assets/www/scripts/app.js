var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var App;
(function (App) {
    var Core;
    (function (Core) {
        var AppDispatcher = (function (_super) {
            __extends(AppDispatcher, _super);
            function AppDispatcher() {
                _super.apply(this, arguments);
            }
            AppDispatcher.prototype.registerAction = function (module, action, callback) {
                return _super.prototype.register.call(this, function (payload) {
                    if (payload.module !== module || payload.action !== action)
                        return;
                    callback(payload);
                });
            };
            return AppDispatcher;
        })(Flux.Dispatcher);
        Core.Dispatcher = new AppDispatcher();
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Actions;
        (function (Actions) {
            Actions.Cordova = 'Cordova';
            (function (CordovaActionType) {
                CordovaActionType[CordovaActionType["Pause"] = 0] = "Pause";
                CordovaActionType[CordovaActionType["Resume"] = 1] = "Resume";
                CordovaActionType[CordovaActionType["Online"] = 2] = "Online";
                CordovaActionType[CordovaActionType["Offline"] = 3] = "Offline";
                CordovaActionType[CordovaActionType["BatteryCritical"] = 4] = "BatteryCritical";
            })(Actions.CordovaActionType || (Actions.CordovaActionType = {}));
            var CordovaActionType = Actions.CordovaActionType;
        })(Actions = Core.Actions || (Core.Actions = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Actions;
        (function (Actions) {
            Actions.Routing = 'Routing';
            (function (RoutingActionType) {
                RoutingActionType[RoutingActionType["Navigating"] = 0] = "Navigating";
            })(Actions.RoutingActionType || (Actions.RoutingActionType = {}));
            var RoutingActionType = Actions.RoutingActionType;
        })(Actions = Core.Actions || (Core.Actions = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var Footer = (function (_super) {
                __extends(Footer, _super);
                function Footer() {
                    _super.apply(this, arguments);
                }
                Footer.prototype.render = function () {
                    return React.DOM.footer({
                        id: 'footer'
                    });
                };
                return Footer;
            })(React.Component);
            Components.Footer = Footer;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
/// <reference path="../../../../../typings/tsd.d.ts" />
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var Header = (function (_super) {
                __extends(Header, _super);
                function Header() {
                    _super.apply(this, arguments);
                }
                Header.prototype.render = function () {
                    return React.DOM.header({
                        id: 'header',
                        className: 'bar bar-nav'
                    }, React.DOM.h1({
                        className: 'title'
                    }, "ConnectedMD"));
                };
                return Header;
            })(React.Component);
            Components.Header = Header;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var Layout = (function (_super) {
                __extends(Layout, _super);
                function Layout() {
                    _super.apply(this, arguments);
                }
                Layout.prototype.render = function () {
                    return React.DOM.div(null, React.createElement(Components.Header), React.createElement(Components.NavBar), React.createElement(Components.MainSection), React.createElement(Components.Footer));
                };
                return Layout;
            })(React.Component);
            Components.Layout = Layout;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
/// <reference path="../../../../../typings/tsd.d.ts" />
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var MainSection = (function (_super) {
                __extends(MainSection, _super);
                function MainSection() {
                    _super.apply(this, arguments);
                }
                MainSection.prototype.render = function () {
                    return React.DOM.section({
                        className: 'content'
                    }, React.createElement(ReactRouter.RouteHandler));
                };
                return MainSection;
            })(React.Component);
            Components.MainSection = MainSection;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var NavBar = (function (_super) {
                __extends(NavBar, _super);
                function NavBar() {
                    _super.apply(this, arguments);
                }
                NavBar.prototype.render = function () {
                    return React.DOM.nav({
                        className: 'bar bar-tab'
                    }, React.createElement(App.Core.Components.NavBarItem, { to: "Home", label: 'Home', icon: 'home' }), React.createElement(App.Core.Components.NavBarItem, { to: "About", label: 'About', icon: 'gear' }));
                };
                return NavBar;
            })(React.Component);
            Components.NavBar = NavBar;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Components;
        (function (Components) {
            var NavBarItem = (function (_super) {
                __extends(NavBarItem, _super);
                function NavBarItem() {
                    _super.apply(this, arguments);
                }
                NavBarItem.prototype.render = function () {
                    this.props.className = 'tab-item';
                    this.props.activeClassName = 'active';
                    return React.createElement(ReactRouter.Link, this.props, React.DOM.span({ className: 'icon' + (this.props.icon ? ' icon-' + this.props.icon : '') }), React.DOM.span({ className: 'tab-label' }, this.props.label));
                };
                return NavBarItem;
            })(React.Component);
            Components.NavBarItem = NavBarItem;
        })(Components = Core.Components || (Core.Components = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var Views;
        (function (Views) {
            var About = (function (_super) {
                __extends(About, _super);
                function About() {
                    _super.apply(this, arguments);
                }
                About.prototype.render = function () {
                    return React.DOM.div({ className: 'content-padded' }, React.DOM.h1(null, 'About'), React.DOM.p(null, 'Welcome'));
                };
                return About;
            })(React.Component);
            Views.About = About;
        })(Views = Components.Views || (Components.Views = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Components;
    (function (Components) {
        var Views;
        (function (Views) {
            var Home = (function (_super) {
                __extends(Home, _super);
                function Home() {
                    _super.apply(this, arguments);
                }
                Home.prototype.render = function () {
                    return React.DOM.p({ className: 'content-padded' }, "Hello world !");
                };
                return Home;
            })(React.Component);
            Views.Home = Home;
        })(Views = Components.Views || (Components.Views = {}));
    })(Components = App.Components || (App.Components = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Core;
    (function (Core) {
        var Routes;
        (function (Routes) {
            var RouteConfig = (function () {
                function RouteConfig() {
                }
                RouteConfig.prototype.configureRoutes = function () {
                    return React.createElement(ReactRouter.Route, { handler: App.Core.Components.Layout }, React.createElement(ReactRouter.Route, { name: 'About', path: 'about', handler: App.Components.Views.About }), React.createElement(ReactRouter.DefaultRoute, { name: 'Home', handler: App.Components.Views.Home }));
                };
                return RouteConfig;
            })();
            Routes.RouteConfig = RouteConfig;
        })(Routes = Core.Routes || (Core.Routes = {}));
    })(Core = App.Core || (App.Core = {}));
})(App || (App = {}));
/// <reference path="../../typings/tsd.d.ts" />
var App;
(function (App) {
    var Main = (function () {
        function Main() {
            document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
        }
        Main.prototype._onDeviceReady = function () {
            document.addEventListener('pause', this._onPause.bind(this), false);
            document.addEventListener('resume', this._onResume.bind(this), false);
            this.Start();
        };
        ;
        Main.prototype._onPause = function () {
            App.Core.Dispatcher.dispatch({
                module: App.Core.Actions.Cordova,
                action: App.Core.Actions.CordovaActionType.Pause,
                data: undefined
            });
        };
        ;
        Main.prototype._onResume = function () {
            App.Core.Dispatcher.dispatch({
                module: App.Core.Actions.Cordova,
                action: App.Core.Actions.CordovaActionType.Resume,
                data: undefined
            });
        };
        ;
        Main.prototype.Start = function () {
            var routes = new App.Core.Routes.RouteConfig().configureRoutes();
            ReactRouter.run(routes, function (handler) {
                React.render(React.createElement(handler), document.body);
            });
        };
        return Main;
    })();
    var currentApp = new Main();
})(App || (App = {}));
//# sourceMappingURL=app.js.map