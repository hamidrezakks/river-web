import * as React from 'react';
import {ExitToAppRounded, SettingsRounded, ChatRounded, AccountCircleRounded} from "@material-ui/icons";
import Badge from '@material-ui/core/Badge';

import './style.css';

interface IProps {
    selected: string;
    onSelect?: (item: string) => void;
    unreadCounter: number;
}

interface IState {
    selected: string;
    unreadCounter: number;
}

class BottomBar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            selected: props.selected,
            unreadCounter: props.unreadCounter,
        };
    }

    // public componentDidMount() {
    // }

    public componentWillReceiveProps(newProps: IProps) {
        this.setState({
            selected: newProps.selected,
            unreadCounter: newProps.unreadCounter,
        });
    }

    public render() {
        const {selected, unreadCounter} = this.state;
        const items: any[] = [{
            icon: <AccountCircleRounded/>,
            page: 'contact',
            title: 'Contacts',
        }, {
            badge: true,
            icon: <ChatRounded/>,
            page: 'chat',
            title: 'Chats',
        }, {
            icon: <SettingsRounded/>,
            page: 'setting',
            title: 'Settings',
        }, {
            icon: <ExitToAppRounded/>,
            page: 'logout',
            title: 'Logout',
        }];
        return (
            <div className="bottom-bar">
                {items.map((item, index) => {
                    return (
                        <a onClick={this.onClickHandler.bind(this, item.page)} key={index}
                           className={item.page === selected ? 'active' : ''}>
                            {Boolean(item.badge) && <Badge color="secondary" badgeContent={unreadCounter}
                                                           invisible={Boolean(unreadCounter === 0)}>{item.icon}</Badge>}
                            {!Boolean(item.badge) && <span>{item.icon}</span>}
                            <span className="title">{item.title}</span>
                        </a>);
                })}
            </div>
        );
    }

    private onClickHandler = (item: string) => {
        if (this.props.onSelect) {
            this.props.onSelect(item);
        }
    }
}

export default BottomBar;
