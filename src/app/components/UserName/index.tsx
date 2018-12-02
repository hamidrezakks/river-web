import * as React from 'react';
import {IUser} from '../../repository/user/interface';
import UserRepo from '../../repository/user';
import ContactRepo from '../../repository/contact';
import {GetUniqueColor, SecondaryColors} from '../UserAvatar';

interface IProps {
    className?: string;
    id: string;
    uniqueColor?: boolean;
    you?: boolean;
    onlyFirstName?: boolean;
}

interface IState {
    className: string;
    id: string;
    user: IUser;
    you: boolean;
}

class UserName extends React.Component<IProps, IState> {
    private userRepo: UserRepo;
    private contactRepo: ContactRepo;
    private tryTimeout: any = null;
    private tryCount: number = 0;

    constructor(props: IProps) {
        super(props);

        this.state = {
            className: props.className || '',
            id: props.id,
            user: {},
            you: props.you || false,
        };

        this.userRepo = UserRepo.getInstance();
        this.contactRepo = ContactRepo.getInstance();
    }

    public componentDidMount() {
        this.getUser();
        window.addEventListener('User_DB_Updated', this.getUser);
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (this.state.id !== newProps.id) {
            this.tryTimeout = 0;
            clearTimeout(this.tryTimeout);
            this.setState({
                id: newProps.id,
            }, () => {
                this.getUser();
            });
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('User_DB_Updated', this.getUser);
    }

    public render() {
        const {onlyFirstName} = this.props;
        const {user, className} = this.state;
        let style = {};
        if (this.props.uniqueColor === true) {
            style = {
                color: GetUniqueColor(`${user.firstname}${user.lastname}`, SecondaryColors),
            };
        }
        return (
            <span className={className}
                  style={style}>{(user && user.id) ? (onlyFirstName ? user.firstname : `${user.firstname} ${user.lastname}`) : ''}</span>
        );
    }

    private getUser = (data?: any) => {
        if (!this.state || this.state.id === '') {
            return;
        }

        if (data && data.detail.ids.indexOf(this.state.id) === -1) {
            return;
        }
        if (this.state.you && this.userRepo.getCurrentUserId() === this.state.id) {
            this.setState({
                user: {
                    firstname: 'You',
                    id: this.userRepo.getCurrentUserId(),
                    lastname: '',
                },
            });
            return;
        }

        this.contactRepo.get(this.state.id).then((contact) => {
            this.setState({
                user: {
                    _id: contact.id,
                    firstname: contact.firstname,
                    id: contact.id,
                    lastname: contact.lastname,
                },
            });
        }).catch(() => {
            this.userRepo.get(this.state.id).then((user) => {
                this.setState({
                    user,
                });
            }).catch(() => {
                if (this.tryCount < 10) {
                    this.tryCount++;
                    this.tryTimeout = setTimeout(() => {
                        this.getUser();
                    }, 1000);
                }
            });
        });
    }
}

export default UserName;
