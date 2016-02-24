
namespace ConnectedMD.Core.Components {

    export class NavBar extends React.Component<any, any> {
      
        render() {
            return React.DOM.nav({
                className: 'bar bar-tab'
            },
                React.createElement(ConnectedMD.Core.Components.NavBarItem, { to: "Home", label: 'Home', icon: 'home' }),
                React.createElement(ConnectedMD.Core.Components.NavBarItem, { to: "About", label: 'About', icon: 'gear' })
                );
        }
    }
}