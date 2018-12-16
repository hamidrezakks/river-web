import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import {
    KeyboardBackspaceRounded,
    PaletteRounded,
    FaceRounded,
    EditRounded,
    CheckRounded,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton/IconButton';
import UserAvatar from '../UserAvatar';
import TextField from '@material-ui/core/TextField/TextField';
import {IContact} from '../../repository/contact/interface';
import UserRepo from '../../repository/user';
import SDK from '../../services/sdk';
import {debounce} from 'lodash';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import './style.css';

interface IProps {
    onClose?: () => void;
    subMenu?: string;
    updateMessages?: () => void;
    onSubPlaceChange?: (sub: string) => void;
}

interface IState {
    checked: boolean;
    editProfile: boolean;
    editUsername: boolean;
    firstname: string;
    fontSize: number;
    lastname: string;
    page: string;
    pageContent: string;
    phone: string;
    selectedBackground: string;
    user: IContact | null;
    username: string;
    usernameAvailable: boolean;
    usernameValid: boolean;
}

const backgrounds = [{
    id: '-1',
    title: 'None',
}, {
    id: '1',
    title: '4 Point Star',
}, {
    id: '2',
    title: 'Anchors Away',
}, {
    id: '3',
    title: 'Bank Note',
}, {
    id: '4',
    title: 'Bubbles',
}, {
    id: '5',
    title: 'Glamorous',
}, {
    id: '6',
    title: 'Hideout',
}, {
    id: '7',
    title: 'I Like Food',
}, {
    id: '8',
    title: 'Jigsaw',
}, {
    id: '9',
    title: 'Plus',
}, {
    id: '10',
    title: 'Rounded Plus Connected',
}, {
    id: '11',
    title: 'Skulls',
}, {
    id: '12',
    title: 'Squares in Squares',
}, {
    id: '13',
    title: 'Tic Tac Toe',
}, {
    id: '14',
    title: 'Topography',
}];

class SettingMenu extends React.Component<IProps, IState> {
    private userRepo: UserRepo;
    private sdk: SDK;
    private userId: string;
    private usernameCheckDebounce: any;

    constructor(props: IProps) {
        super(props);

        this.sdk = SDK.getInstance();
        this.userId = this.sdk.getConnInfo().UserID || '';

        this.state = {
            checked: false,
            editProfile: false,
            editUsername: false,
            firstname: '',
            fontSize: 2,
            lastname: '',
            page: (props.subMenu && props.subMenu !== 'none' ? '2' : '1'),
            pageContent: props.subMenu || 'none',
            phone: this.sdk.getConnInfo().Phone || '',
            selectedBackground: '-1',
            user: null,
            username: '',
            usernameAvailable: false,
            usernameValid: false,
        };
        this.userRepo = UserRepo.getInstance();
        this.usernameCheckDebounce = debounce(this.checkUsername, 256);
        if (props.subMenu === 'account') {
            this.getUser();
        }
    }

    public componentDidMount() {
        const el = document.querySelector('html');
        if (!el) {
            return;
        }
        this.setState({
            checked: (el.getAttribute('theme') === 'dark'),
            fontSize: parseInt(el.getAttribute('font') || '2', 10),
            selectedBackground: el.getAttribute('bg') || '-1',
        });
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (newProps.subMenu !== 'none') {
            this.setState({
                page: '2',
                pageContent: newProps.subMenu || 'none',
            });
            if (newProps.subMenu === 'account') {
                this.getUser();
            }
        } else {
            this.setState({
                pageContent: newProps.subMenu || 'none',
            });
        }
    }

    public render() {
        const {page, pageContent, user, editProfile, editUsername, firstname, lastname, phone, username, usernameAvailable, usernameValid} = this.state;
        return (
            <div className="setting-menu">
                <div className={'page-container page-' + page}>
                    <div className="page page-1">
                        <div className="menu-header">
                            <IconButton
                                aria-label="Close"
                                aria-haspopup="true"
                                onClick={this.props.onClose}
                            >
                                <KeyboardBackspaceRounded/>
                            </IconButton>
                            <label>Settings</label>
                        </div>
                        <div className="menu-content">
                            <FormControlLabel className="setting-switch-label" control={
                                <Switch
                                    checked={this.state.checked}
                                    className="setting-switch"
                                    color="default"
                                    onChange={this.nightModeHandler}
                                />
                            } label="Night mode"/>
                            <div className="page-anchor" onClick={this.accountPageHandler}>
                                <div className="icon">
                                    <div className="icon-primary">
                                        <FaceRounded/>
                                    </div>
                                    <div className="icon-secondary">
                                        <UserAvatar className="avatar" id={this.userId || ''}/>
                                    </div>
                                </div>
                                Account ({phone})
                            </div>
                            <div className="page-anchor" onClick={this.themePageHandler}>
                                <PaletteRounded/> Theme
                            </div>
                        </div>
                    </div>
                    <div className="page page-2">
                        {Boolean(pageContent === 'theme') && <div>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>Theme</label>
                            </div>
                            <div className="menu-content">
                                <FormControlLabel className="setting-switch-label" control={
                                    <Switch
                                        checked={this.state.checked}
                                        className="setting-switch"
                                        color="default"
                                        onChange={this.nightModeHandler}
                                    />
                                } label="Night mode"/>
                                <label className="label font-size-label">Font Size</label>
                                <MobileStepper
                                    variant="progress"
                                    steps={6}
                                    position="static"
                                    activeStep={this.state.fontSize}
                                    className="font-size-container"
                                    nextButton={
                                        <Button size="small" onClick={this.handleNext}
                                                disabled={this.state.fontSize === 5}>
                                            <KeyboardArrowRight/>
                                        </Button>
                                    }
                                    backButton={
                                        <Button size="small" onClick={this.handleBack}
                                                disabled={this.state.fontSize === 0}>
                                            <KeyboardArrowLeft/>
                                        </Button>
                                    }
                                />
                                <label className="label">Background</label>
                                <GridList className="background-container" cellHeight={100} spacing={6}>
                                    {backgrounds.map((bg, index) => (
                                        <GridListTile key={index} cols={1} rows={1}
                                                      onClick={this.selectBackgroundHandler.bind(this, bg.id)}>
                                            <div className={'bg-item bg-' + bg.id}/>
                                            <GridListTileBar
                                                className={'title-bar ' + (this.state.selectedBackground === bg.id ? 'selected' : '')}
                                                title={bg.title}
                                                titlePosition="bottom"
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </div>
                        </div>}
                        {Boolean(pageContent === 'account') && <div>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>Account</label>
                            </div>
                            {user && <div className="info kk-card">
                                <div className="avatar">
                                    <UserAvatar id={user.id || ''}/>
                                </div>
                                <div className="line">
                                    {!editProfile && <div className="form-control">
                                        <label>First Name</label>
                                        <div className="inner">{user.firstname}</div>
                                        <div className="action">
                                            {!editUsername && <IconButton
                                                aria-label="Edit title"
                                                onClick={this.onEditProfileHandler}
                                            >
                                                <EditRounded/>
                                            </IconButton>}
                                        </div>
                                    </div>}
                                    {editProfile &&
                                    <TextField
                                        label="First Name"
                                        fullWidth={true}
                                        inputProps={{
                                            maxLength: 32,
                                        }}
                                        value={firstname}
                                        className="input-edit"
                                        onChange={this.onFirstnameChangeHandler}
                                    />}
                                </div>
                                <div className="line">
                                    {!editProfile && <div className="form-control">
                                        <label>Last Name</label>
                                        <div className="inner">{user.lastname}</div>
                                        <div className="action">
                                            {!editUsername && <IconButton
                                                aria-label="Edit title"
                                                onClick={this.onEditProfileHandler}
                                            >
                                                <EditRounded/>
                                            </IconButton>}
                                        </div>
                                    </div>}
                                    {editProfile &&
                                    <TextField
                                        label="Last Name"
                                        fullWidth={true}
                                        inputProps={{
                                            maxLength: 32,
                                        }}
                                        value={lastname}
                                        className="input-edit"
                                        onChange={this.onLastnameChangeHandler}
                                    />}
                                </div>
                                <div className="line">
                                    {!editUsername && <div className="form-control">
                                        <label>Username</label>
                                        <div className="inner">{user.username}</div>
                                        <div className="action">
                                            {!editProfile && <IconButton
                                                aria-label="Edit title"
                                                onClick={this.onEditUsernameHandler}
                                            >
                                                <EditRounded/>
                                            </IconButton>}
                                        </div>
                                    </div>}
                                    {editUsername &&
                                    <TextField
                                        label="Username"
                                        fullWidth={true}
                                        inputProps={{
                                            maxLength: 32,
                                        }}
                                        value={username}
                                        className="input-edit"
                                        onChange={this.onUsernameChangeHandler}
                                        error={!usernameAvailable || !usernameValid}
                                        helperText={!usernameAvailable ? 'Username is not available' : (!usernameValid ? 'Username is not valid' : '')}
                                    />}
                                </div>
                                <div className="line">
                                    <div className="form-control pad">
                                        <label>phone</label>
                                        <div className="inner">{phone}</div>
                                    </div>
                                </div>
                                {Boolean(editProfile && user && ((user.firstname !== firstname || user.lastname !== lastname))) &&
                                <div className="actions-bar">
                                    <div className="add-action" onClick={this.confirmProfileChangesHandler}>
                                        <CheckRounded/>
                                    </div>
                                </div>}
                                {Boolean(editUsername && user && user.username !== username && usernameAvailable && usernameValid) &&
                                <div className="actions-bar">
                                    <div className="add-action" onClick={this.confirmUsernameChangeHandler}>
                                        <CheckRounded/>
                                    </div>
                                </div>}
                            </div>}
                        </div>}
                    </div>
                </div>
            </div>
        );
    }

    private nightModeHandler = (e: any) => {
        const el = document.querySelector('html');
        if (!el) {
            return;
        }
        if (e.currentTarget.checked) {
            el.setAttribute('theme', 'dark');
            localStorage.setItem('river.theme.color', 'dark');
        } else {
            el.setAttribute('theme', 'light');
            localStorage.setItem('river.theme.color', 'light');
        }
        this.setState({
            checked: e.currentTarget.checked,
        });
    }

    private handleNext = () => {
        this.setState(state => ({
            fontSize: state.fontSize + 1,
        }), () => {
            this.changeFontSize();
        });
    }

    private handleBack = () => {
        this.setState(state => ({
            fontSize: state.fontSize - 1,
        }), () => {
            this.changeFontSize();
        });
    }

    private changeFontSize() {
        const el = document.querySelector('html');
        if (!el) {
            return;
        }
        localStorage.setItem('river.theme.font', String(this.state.fontSize));
        el.setAttribute('font', String(this.state.fontSize));
        if (this.props.updateMessages) {
            this.props.updateMessages();
        }
    }

    private onPrevHandler = () => {
        this.setState({
            editProfile: false,
            editUsername: false,
            page: '1',
            pageContent: 'none',
        }, () => {
            this.dispatchSubPlaceChange();
        });
    }

    private themePageHandler = () => {
        this.setState({
            page: '2',
            pageContent: 'theme',
        }, () => {
            this.dispatchSubPlaceChange();
        });
    }

    private getUser() {
        this.userRepo.get(this.userId).then((res) => {
            this.setState({
                firstname: res.firstname || '',
                lastname: res.lastname || '',
                user: res,
                username: res.username || '',
            });
        });
    }

    private accountPageHandler = () => {
        this.getUser();
        this.setState({
            page: '2',
            pageContent: 'account',
        }, () => {
            this.dispatchSubPlaceChange();
        });
    }

    private onEditProfileHandler = () => {
        this.setState({
            editProfile: true,
        });
    }

    private onEditUsernameHandler = () => {
        this.setState({
            editUsername: true,
            usernameAvailable: false,
            usernameValid: false,
        });
    }

    private onFirstnameChangeHandler = (e: any) => {
        this.setState({
            firstname: e.currentTarget.value,
        });
    }

    private onLastnameChangeHandler = (e: any) => {
        this.setState({
            lastname: e.currentTarget.value,
        });
    }

    private onUsernameChangeHandler = (e: any) => {
        const username = e.currentTarget.value;
        const reg = /^(?=.{2,32}$)[a-zA-Z0-9._]/;
        this.setState({
            usernameValid: reg.test(username),
        }, () => {
            if (this.state.usernameValid) {
                this.usernameCheckDebounce(username);
            }
        });
        this.setState({
            username,
        });
    }

    private checkUsername = (username: string) => {
        this.sdk.usernameAvailable(username).then((res) => {
            this.setState({
                usernameAvailable: res.result || false,
            });
        });
    }

    private selectBackgroundHandler = (id: string) => {
        this.setState({
            selectedBackground: id,
        }, () => {
            const el = document.querySelector('html');
            if (!el) {
                return;
            }
            localStorage.setItem('river.theme.bg', id);
            el.setAttribute('bg', id);
        });
    }

    private confirmProfileChangesHandler = () => {
        const {firstname, lastname, user} = this.state;
        if (!user) {
            return;
        }
        this.sdk.updateProfile(firstname, lastname).then(() => {
            user.firstname = firstname;
            user.lastname = lastname;
            this.setState({
                editProfile: false,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                user,
            });
            this.userRepo.importBulk([user]);
        }).catch(() => {
            this.setState({
                editProfile: false,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                user,
            });
        });
    }

    private confirmUsernameChangeHandler = () => {
        const {username, usernameAvailable, usernameValid, user} = this.state;
        if (!user) {
            return;
        }
        if (!usernameAvailable || !usernameValid) {
            this.setState({
                editUsername: false,
                username: user.username || '',
            });
            return;
        }
        this.sdk.updateUsername(username).then((res) => {
            user.firstname = res.firstname;
            user.lastname = res.lastname;
            user.username = res.username;
            this.setState({
                editUsername: false,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                user,
                username: user.username || '',
            });
            this.userRepo.importBulk([user]);
        }).catch(() => {
            this.setState({
                editUsername: false,
                user,
                username: user.username || '',
            });
        });
    }

    /* Dispatch sub place change */
    private dispatchSubPlaceChange() {
        if (this.props.onSubPlaceChange) {
            this.props.onSubPlaceChange(this.state.pageContent);
        }
    }
}

export default SettingMenu;
