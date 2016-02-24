namespace ConnectedMD.Components.Views {

    export class About extends React.Component<any, any>{
        render() {
            return React.DOM.div({ className: 'content-padded' },
                React.DOM.h1(null, 'About'),
                React.DOM.p(null, 'Welcome'));
        }
    }
}