
namespace ConnectedMD.Core.Routes {
    
    export class RouteConfig {

        configureRoutes() {
            return React.createElement(ReactRouter.Route, { handler: ConnectedMD.Core.Components.Layout },
                React.createElement(ReactRouter.Route, { name: 'About', path: 'about', handler: ConnectedMD.Components.Views.About }),
                React.createElement(ReactRouter.DefaultRoute, { name: 'Home', handler: ConnectedMD.Components.Views.Home }));
        }
    }
}