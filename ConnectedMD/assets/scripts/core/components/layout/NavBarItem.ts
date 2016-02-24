namespace ConnectedMD.Core.Components {

    export interface NavBarItemProps extends ReactRouter.LinkProp {
        icon?: string,
        label: string,
    }

    export class NavBarItem extends React.Component<NavBarItemProps, any> {
        render() {
            this.props.className = 'tab-item';
            this.props.activeClassName = 'active';

            return React.createElement(ReactRouter.Link, this.props,
                React.DOM.span({ className: 'icon' + (this.props.icon ? ' icon-' + this.props.icon : '') }),
                React.DOM.span({ className: 'tab-label' }, this.props.label));
        }
    }
}