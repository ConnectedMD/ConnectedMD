/// <reference path="../../../../../typings/tsd.d.ts" />

namespace ConnectedMD.Core.Components {

    export class Header extends React.Component<any, any>{
        render() {
            return React.DOM.header({
                id: 'header',
                className: 'bar bar-nav'
            }, React.DOM.h1({
                className: 'title'
            }, "ConnectedMD"));
        }
    }
}