namespace ConnectedMD.Core.Components {

    export class Layout extends React.Component<any, any> {
        render() {
            return React.DOM.div(null
                , React.createElement(Header)
                , React.createElement(NavBar)
                , React.createElement(MainSection)
                , React.createElement(Footer));
        }
    }

}