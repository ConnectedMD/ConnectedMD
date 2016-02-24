/// <reference path="../../../../../typings/tsd.d.ts" />

namespace ConnectedMD.Core.Components {

    export class MainSection extends React.Component<any, any>{

        render() {
            return React.DOM.section({
                className: 'content'
            }, React.createElement(ReactRouter.RouteHandler));
        }
    }
}