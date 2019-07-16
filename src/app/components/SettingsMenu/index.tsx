/*
    Creation Time: 2018 - Oct - 14
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import * as React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import {
    KeyboardBackspaceRounded, PaletteRounded/*, PersonRounded*/, EditRounded, CheckRounded, BookmarkRounded,
    PhotoCameraRounded, CloseRounded, FormatSizeRounded, ChatBubbleRounded, FormatColorFillRounded, CollectionsRounded,
    Brightness2Rounded, ClearAllRounded, DataUsageRounded, LanguageRounded, DoneRounded,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton/IconButton';
import UserAvatar from '../UserAvatar';
import TextField from '@material-ui/core/TextField/TextField';
import UserRepo from '../../repository/user';
import SDK from '../../services/sdk';
import {debounce, find} from 'lodash';
import Scrollbars from 'react-custom-scrollbars';
import {bgTypes, bubbles, C_CUSTOM_BG, storageItems, themes} from './vars/theme';
import {IUser} from '../../repository/user/interface';
import {Link} from 'react-router-dom';
import FileManager, {IFileProgress} from '../../services/sdk/fileManager';
import UniqueId from '../../services/uniqueId';
import ProgressBroadcaster from '../../services/progress';
import RiverTime from '../../services/utilities/river_time';
import {InputFile, InputUser} from '../../services/sdk/messages/chat.core.types_pb';
import DocumentViewerService, {IDocument} from '../../services/documentViewerService';
import Menu from '@material-ui/core/Menu/Menu';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import AvatarCropper from '../AvatarCropper';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import OverlayDialog from '@material-ui/core/Dialog/Dialog';
import Broadcaster from '../../services/broadcaster';
import {AccountAuthorization} from '../../services/sdk/messages/chat.api.accounts_pb';
import TimeUtility from '../../services/utilities/time';
import {findIndex} from 'lodash';
import SettingsBackgroundModal, {ICustomBackground} from '../SettingsBackgroundModal';
import FileRepo from '../../repository/file';
import BackgroundService from '../../services/backgroundService';
import Radio from '@material-ui/core/Radio';
import DownloadManager, {IDownloadSettings} from '../../services/downloadManager';
import SettingsStorageUsageModal from '../SettingsStorageUsageModal';
import {Loading} from '../Loading';
import i18n from '../../services/i18n';
import Slider from "@material-ui/lab/Slider";
import UserName from "../UserName";

import './style.css';
import 'react-image-crop/dist/ReactCrop.css';

export const C_VERSION = '0.24.46';
export const C_CUSTOM_BG_ID = 'river_custom_bg';

export const languageList = [{
    dir: 'rtl',
    label: 'Farsi',
    lang: 'fa',
    title: 'فارسی'
}, {
    dir: 'ltr',
    label: 'English',
    lang: 'en',
    title: 'English'
}];

interface IProps {
    onClose?: () => void;
    onAction?: (cmd: 'logout') => void;
    subMenu?: string;
    updateMessages?: (keep?: boolean) => void;
    onReloadDialog?: (peerIds: string[]) => void;
    onSubPlaceChange?: (sub: string) => void;
}

interface IState {
    avatarMenuAnchorEl: any;
    bio: string;
    confirmDialogOpen: boolean;
    confirmDialogSelectedId: string;
    customBackgroundSrc?: string;
    debugModeOpen: boolean;
    debugModeUrl: string;
    debugThrottleInterval: number;
    editProfile: boolean;
    editUsername: boolean;
    firstname: string;
    fontSize: number;
    lastname: string;
    loading: boolean;
    page: string;
    pageContent: string;
    phone: string;
    profileCropperOpen: boolean;
    profilePictureCrop: any;
    profilePictureFile?: string;
    riverGroupName: string;
    selectedBackground: string;
    selectedBgType: string;
    selectedBubble: string;
    selectedCustomBackground: string;
    selectedCustomBackgroundBlur: number;
    selectedLanguage: string;
    selectedTheme: string;
    sessions?: AccountAuthorization.AsObject[];
    storageValues: IDownloadSettings;
    uploadingPhoto: boolean;
    user: IUser | null;
    username: string;
    usernameAvailable: boolean;
    usernameValid: boolean;
}

class SettingsMenu extends React.Component<IProps, IState> {
    private userRepo: UserRepo;
    private sdk: SDK;
    private readonly userId: string;
    private readonly currentAuthID: string;
    private readonly usernameCheckDebounce: any;
    private fileManager: FileManager;
    private fileRepo: FileRepo;
    private progressBroadcaster: ProgressBroadcaster;
    private riverTime: RiverTime;
    private profileTempPhoto: string = '';
    private circleProgressRef: any = null;
    private fileId: string = '';
    private cropperRef: AvatarCropper;
    private documentViewerService: DocumentViewerService;
    private versionClickTimeout: any = null;
    private versionClickCounter: number = 0;
    private broadcaster: Broadcaster;
    private settingsBackgroundModalRef: SettingsBackgroundModal;
    private backgroundService: BackgroundService;
    private downloadManger: DownloadManager;
    private settingsStorageUsageModalRef: SettingsStorageUsageModal;

    constructor(props: IProps) {
        super(props);

        this.sdk = SDK.getInstance();
        this.userId = this.sdk.getConnInfo().UserID || '';

        this.state = {
            avatarMenuAnchorEl: null,
            bio: '',
            confirmDialogOpen: false,
            confirmDialogSelectedId: '',
            debugModeOpen: false,
            debugModeUrl: localStorage.getItem('river.workspace_url') || 'river.ronaksoftware.com',
            debugThrottleInterval: parseInt(localStorage.getItem('river.debug.throttle_interval') || '200', 10),
            editProfile: false,
            editUsername: false,
            firstname: '',
            fontSize: 2,
            lastname: '',
            loading: false,
            page: (props.subMenu && props.subMenu !== 'none' ? '2' : '1'),
            pageContent: props.subMenu || 'none',
            phone: this.sdk.getConnInfo().Phone || '',
            profileCropperOpen: false,
            profilePictureCrop: {
                aspect: 1,
                width: 640,
                x: 0,
                y: 0,
            },
            riverGroupName: '',
            selectedBackground: '-1',
            selectedBgType: '0',
            selectedBubble: '1',
            selectedCustomBackground: localStorage.getItem('river.theme.bg.pic') || '-1',
            selectedCustomBackgroundBlur: parseInt(localStorage.getItem('river.theme.bg.blur') || '0', 10),
            selectedLanguage: localStorage.getItem('river.lang') || 'en',
            selectedTheme: localStorage.getItem('river.theme.color') || 'light',
            storageValues: {
                auto_save_files: false,
                chat_files: false,
                chat_photos: false,
                chat_videos: false,
                chat_voices: false,
                download_all: false,
                group_files: false,
                group_photos: false,
                group_videos: false,
                group_voices: false,
            },
            uploadingPhoto: false,
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
        this.fileManager = FileManager.getInstance();
        this.fileRepo = FileRepo.getInstance();
        this.progressBroadcaster = ProgressBroadcaster.getInstance();
        this.riverTime = RiverTime.getInstance();

        this.documentViewerService = DocumentViewerService.getInstance();
        this.broadcaster = Broadcaster.getInstance();
        this.backgroundService = BackgroundService.getInstance();
        this.downloadManger = DownloadManager.getInstance();

        this.currentAuthID = this.sdk.getConnInfo().AuthID;
    }

    public componentDidMount() {
        const bg = localStorage.getItem('river.theme.bg') || '-1';
        let bgType: string = '0';
        if (bg === C_CUSTOM_BG) {
            bgType = '1';
        } else if (bg === '0') {
            bgType = '0';
        } else {
            bgType = '2';
        }
        this.setState({
            fontSize: parseInt(localStorage.getItem('river.theme.font') || '2', 10),
            selectedBackground: bg,
            selectedBgType: bgType,
            selectedBubble: localStorage.getItem('river.theme.bubble') || '1',
            selectedTheme: localStorage.getItem('river.theme.color') || 'light',
            storageValues: this.downloadManger.getDownloadSettings(),
        });
        this.backgroundService.getBackground(C_CUSTOM_BG_ID).then((res) => {
            if (res) {
                this.setState({
                    customBackgroundSrc: URL.createObjectURL(res),
                });
            }
        });
        this.sdk.systemGetInfo(true).then((res) => {
            this.setState({
                riverGroupName: res.workgroupname || '',
            });
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
            if (newProps.subMenu === 'none') {
                this.setState({
                    page: '1',
                });
            }
        }
    }

    public render() {
        const {
            avatarMenuAnchorEl, page, pageContent, user, editProfile, editUsername, bio, firstname, lastname, phone,
            username, usernameAvailable, usernameValid, uploadingPhoto, debugModeOpen, sessions, confirmDialogOpen,
            customBackgroundSrc, loading
        } = this.state;
        return (
            <div className="setting-menu">
                <AvatarCropper ref={this.cropperRefHandler} onImageReady={this.croppedImageReadyHandler} width={640}/>
                <SettingsBackgroundModal ref={this.settingsBackgroundModalRefHandler}
                                         dark={Boolean(this.state.selectedTheme !== 'light')}
                                         defId={this.state.selectedCustomBackground}
                                         defBlur={this.state.selectedCustomBackgroundBlur}
                                         onDone={this.settingsBackgroundModalDoneHandler}
                                         onPatternSelected={this.selectBackgroundHandler}/>
                <SettingsStorageUsageModal ref={this.settingsStorageUsageModalRefHandler}
                                           onDone={this.props.onReloadDialog}/>
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
                            <label>{i18n.t('settings.settings')}</label>
                        </div>
                        <div className="menu-content with-footer">
                            <Scrollbars
                                autoHide={true}
                            >
                                <div className="padding-side">
                                    <div className="account-summary">
                                        <div className="account-profile"
                                             onClick={this.selectPageHandler.bind(this, 'account')}>
                                            <UserAvatar className="avatar" id={this.userId} noDetail={true}/>
                                        </div>
                                        <div className="account-info"
                                             onClick={this.selectPageHandler.bind(this, 'account')}>
                                            <UserName className="username" id={this.userId} noDetail={true}/>
                                            <div className="account-phone">{phone}</div>
                                        </div>
                                    </div>
                                    <div className="page-anchor">
                                        <Link to={`/chat/${this.userId}`}>
                                            <div className="icon color-saved-messages">
                                                <BookmarkRounded/>
                                            </div>
                                            <div className="anchor-label">{i18n.t('general.saved_messages')}</div>
                                        </Link>
                                    </div>
                                    <div className="page-anchor" onClick={this.selectPageHandler.bind(this, 'storage')}>
                                        <div className="icon color-data">
                                            <DataUsageRounded/>
                                        </div>
                                        <div className="anchor-label">{i18n.t('settings.data_and_storage')}</div>
                                    </div>
                                    <div className="page-anchor" onClick={this.selectPageHandler.bind(this, 'session')}>
                                        <div className="icon color-session">
                                            <ClearAllRounded/>
                                        </div>
                                        <div className="anchor-label">{i18n.t('settings.active_sessions')}</div>
                                    </div>
                                    <div className="page-anchor" onClick={this.selectPageHandler.bind(this, 'theme')}>
                                        <div className="icon color-theme">
                                            <PaletteRounded/>
                                        </div>
                                        <div className="anchor-label">{i18n.t('settings.theme')}</div>
                                    </div>
                                    <div className="page-anchor"
                                         onClick={this.selectPageHandler.bind(this, 'language')}>
                                        <div className="icon color-language">
                                            <LanguageRounded/>
                                        </div>
                                        <div className="anchor-label">{i18n.t('settings.language')}</div>
                                    </div>
                                    <div className="page-anchor">
                                        <div className="icon color-night-mode">
                                            <Brightness2Rounded/>
                                        </div>
                                        <div className="anchor-label">{i18n.t('settings.night_mode')}</div>
                                        <div className="setting-switch-label">
                                            <Switch
                                                checked={Boolean(this.state.selectedTheme !== 'light')}
                                                className={'setting-switch' + (Boolean(this.state.selectedTheme !== 'light') ? ' checked' : '')}
                                                color="default"
                                                onChange={this.nightModeHandler}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Scrollbars>
                        </div>
                        <div className="version" onClick={this.versionClickHandler}>
                            v{C_VERSION}
                            <span className="group-name">{this.state.riverGroupName}</span>
                        </div>
                    </div>
                    <div className="page page-2">
                        {Boolean(pageContent === 'theme') && <React.Fragment>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>{i18n.t('settings.theme')}</label>
                            </div>
                            <div className="menu-content">
                                <Scrollbars
                                    autoHide={true}
                                >
                                    <div className="padding-side">
                                        <div className="page-content" style={{overflow: 'hidden'}}>
                                            <div className="page-anchor">
                                                <div className="icon color-font-size">
                                                    <FormatSizeRounded/>
                                                </div>
                                                <div className="anchor-label">{i18n.t('settings.font_size')}</div>
                                            </div>
                                            <div className="page-content-inner">
                                                <div className="font-size-container">
                                                    <Button size="small" onClick={this.handleNext}
                                                            disabled={this.state.fontSize === 5}>
                                                        <KeyboardArrowRight/>
                                                    </Button>
                                                    <Slider
                                                        value={this.state.fontSize}
                                                        min={0}
                                                        max={5}
                                                        step={1}
                                                        onChange={this.fontSizeChangeHandler}
                                                        className="slider"
                                                    />
                                                    <Button size="small" onClick={this.handleBack}
                                                            disabled={this.state.fontSize === 0}>
                                                        <KeyboardArrowLeft/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="page-content">
                                            <div className="page-anchor">
                                                <div className="icon color-theme-type">
                                                    <FormatColorFillRounded/>
                                                </div>
                                                <div className="anchor-label">{i18n.t('settings.theme')}</div>
                                            </div>
                                            <div className="page-content-inner">
                                                <div
                                                    className="theme-container"
                                                >
                                                    {themes.map((theme, index) => (
                                                        <div key={index}
                                                             className={'radio-item ' + (this.state.selectedTheme === theme.id ? 'selected' : '')}
                                                             onClick={this.selectThemeHandler.bind(this, theme.id)}
                                                        >
                                                            <div className="radio-label">
                                                                <Radio color="primary"
                                                                       className={'radio ' + (this.state.selectedTheme === theme.id ? 'checked' : '')}
                                                                       checked={(this.state.selectedTheme === theme.id)}/>
                                                                <div className="radio-title">{i18n.t(theme.title)}</div>
                                                            </div>
                                                            <div
                                                                className={'item theme-' + theme.id + ' bubble-' + this.state.selectedBubble + ' bg-' + this.state.selectedBackground}/>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="page-content">
                                            <div className="page-anchor">
                                                <div className="icon color-bubble">
                                                    <ChatBubbleRounded/>
                                                </div>
                                                <div className="anchor-label">{i18n.t('settings.bubble')}</div>
                                            </div>
                                            <div className="page-content-inner">
                                                <div
                                                    className="theme-container"
                                                >
                                                    {bubbles.map((bubble, index) => (
                                                        <div key={index}
                                                             className={'radio-item ' + (this.state.selectedBubble === bubble.id ? 'selected' : '')}
                                                             onClick={this.selectBubbleHandler.bind(this, bubble.id)}
                                                        >
                                                            <div className="radio-label">
                                                                <Radio color="primary"
                                                                       className={'radio ' + (this.state.selectedBubble === bubble.id ? 'checked' : '')}
                                                                       checked={(this.state.selectedBubble === bubble.id)}/>
                                                                <div
                                                                    className="radio-title">{i18n.t(bubble.title)}</div>
                                                            </div>
                                                            <div
                                                                className={'item bubble-' + bubble.id + ' theme-' + this.state.selectedTheme + ' bg-' + this.state.selectedBackground}/>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="page-content">
                                            <div className="page-anchor">
                                                <div className="icon color-background">
                                                    <CollectionsRounded/>
                                                </div>
                                                <div className="anchor-label">{i18n.t('settings.background')}</div>
                                            </div>
                                            <div className="page-content-inner">
                                                <div
                                                    className="theme-container"
                                                >
                                                    {bgTypes.map((types, index) => (
                                                        <div key={index}
                                                             className={'radio-item ' + (this.state.selectedBgType === types.id ? 'selected' : '')}
                                                             onClick={this.selectBgTypeHandler.bind(this, types.id)}
                                                        >
                                                            <div className="radio-label">
                                                                <Radio color="primary"
                                                                       className={'radio ' + (this.state.selectedBgType === types.id ? 'checked' : '')}
                                                                       checked={(this.state.selectedBgType === types.id)}/>
                                                                <div className="radio-title">{i18n.t(types.title)}</div>
                                                            </div>
                                                            {Boolean(types.id !== '1') && <div
                                                                className={'item bubble-' + this.state.selectedBubble + ' theme-' + this.state.selectedTheme + ' bg-' + this.state.selectedBackground}/>}
                                                            {Boolean(types.id === '1') && <div
                                                                className={'item bubble-' + this.state.selectedBubble + ' theme-' + this.state.selectedTheme + ' bg-' + this.state.selectedBackground}>
                                                                {customBackgroundSrc &&
                                                                <img src={customBackgroundSrc}/>}
                                                            </div>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Scrollbars>
                            </div>
                        </React.Fragment>}
                        {Boolean(pageContent === 'account') && <React.Fragment>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>{i18n.t('settings.account')}</label>
                            </div>
                            <div className="menu-content">
                                {user &&
                                <Scrollbars
                                    autoHide={true}
                                >
                                    <div className="info">
                                        <div className="avatar" onClick={this.avatarMenuAnchorOpenHandler}>
                                            {!uploadingPhoto && <UserAvatar id={user.id || ''} noDetail={true}/>}
                                            {uploadingPhoto &&
                                            <img src={this.profileTempPhoto} className="avatar-image"/>}
                                            <div className={'overlay ' + (uploadingPhoto ? 'show' : '')}>
                                                {!uploadingPhoto && <React.Fragment>
                                                    <PhotoCameraRounded/>
                                                    <div className="text">
                                                        {i18n.t('peer_info.CHANGE')}
                                                        <br/>
                                                        {i18n.t('peer_info.PROFILE')}
                                                        <br/>
                                                        {i18n.t('peer_info.PHOTO')}
                                                    </div>
                                                </React.Fragment>}
                                                {uploadingPhoto &&
                                                <div className="progress-action">
                                                    <div className="progress">
                                                        <svg viewBox="0 0 32 32">
                                                            <circle ref={this.progressRefHandler} r="14" cx="16"
                                                                    cy="16"/>
                                                        </svg>
                                                    </div>
                                                    <CloseRounded className="action"
                                                                  onClick={this.cancelFileHandler}/>
                                                </div>}
                                            </div>
                                        </div>
                                        <div className="line">
                                            {!editProfile && <div className="form-control">
                                                <label>{i18n.t('general.first_name')}</label>
                                                <div className="inner">{user.firstname}</div>
                                                <div className="action">
                                                    {!editUsername && <IconButton
                                                        aria-label="Edit firstname"
                                                        onClick={this.onEditProfileHandler}
                                                    >
                                                        <EditRounded/>
                                                    </IconButton>}
                                                </div>
                                            </div>}
                                            {editProfile &&
                                            <TextField
                                                label={i18n.t('general.first_name')}
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
                                                <label>{i18n.t('general.last_name')}</label>
                                                <div className="inner">{user.lastname}</div>
                                                <div className="action">
                                                    {!editUsername && <IconButton
                                                        onClick={this.onEditProfileHandler}
                                                    >
                                                        <EditRounded/>
                                                    </IconButton>}
                                                </div>
                                            </div>}
                                            {editProfile &&
                                            <TextField
                                                label={i18n.t('general.last_name')}
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
                                            {!editProfile && <div className="form-control">
                                                <label>{i18n.t('general.bio')}</label>
                                                <div className="inner">{user.bio}</div>
                                                <div className="action">
                                                    {!editUsername && <IconButton
                                                        onClick={this.onEditProfileHandler}
                                                    >
                                                        <EditRounded/>
                                                    </IconButton>}
                                                </div>
                                            </div>}
                                            {editProfile &&
                                            <TextField
                                                label={i18n.t('general.bio')}
                                                fullWidth={true}
                                                inputProps={{
                                                    maxLength: 32,
                                                }}
                                                value={bio}
                                                multiline={true}
                                                rowsMax={3}
                                                className="input-edit"
                                                onChange={this.onBioChangeHandler}
                                            />}
                                        </div>
                                        <div className="line">
                                            {!editUsername && <div className="form-control">
                                                <label>{i18n.t('general.username')}</label>
                                                <div className="inner">{user.username}</div>
                                                <div className="action">
                                                    {!editProfile && <IconButton
                                                        onClick={this.onEditUsernameHandler}
                                                    >
                                                        <EditRounded/>
                                                    </IconButton>}
                                                </div>
                                            </div>}
                                            {editUsername &&
                                            <TextField
                                                label={i18n.t('general.username')}
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
                                                <label>{i18n.t('general.phone')}</label>
                                                <div className="inner">{phone}</div>
                                            </div>
                                        </div>
                                        {Boolean(editProfile && user && (user.firstname !== firstname || user.lastname !== lastname || user.bio !== bio)) &&
                                        <div className="actions-bar">
                                            <div className="add-action" onClick={this.confirmProfileChangesHandler}>
                                                <CheckRounded/>
                                            </div>
                                        </div>}
                                        {Boolean(editUsername && user && (user.username !== username || username === '') && usernameAvailable && usernameValid) &&
                                        <div className="actions-bar">
                                            <div className="add-action" onClick={this.confirmUsernameChangeHandler}>
                                                <CheckRounded/>
                                            </div>
                                        </div>}
                                        {Boolean(editProfile || editUsername) && <div
                                            className={'actions-bar cancel' + ((user && ((user.username !== username && usernameAvailable && usernameValid) || (user.firstname !== firstname || user.lastname !== lastname || user.bio !== bio))) ? ' no-padding' : '')}
                                            onClick={this.cancelHandler}>
                                            {i18n.t('general.cancel')}
                                        </div>}
                                        <div className="page-anchor log-out" onClick={this.logOutHandler}>
                                            <Button color="secondary" fullWidth={true}>
                                                {i18n.t('settings.log_out')}
                                            </Button>
                                        </div>
                                    </div>
                                </Scrollbars>}
                            </div>
                        </React.Fragment>}
                        {Boolean(pageContent === 'session') && <React.Fragment>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>{i18n.t('settings.active_sessions')}</label>
                            </div>
                            {sessions && <div className="menu-content">
                                {Boolean(sessions.length > 0 && !loading) && <Scrollbars
                                    autoHide={true}
                                >
                                    <div>
                                        {sessions.map((item, key) => {
                                            // @ts-ignore
                                            if (item.type === 'terminate_all') {
                                                if (sessions.length > 2) {
                                                    return (
                                                        <div key={key} className="session-item terminate-all">
                                                            <span
                                                                onClick={this.terminateSessionConfirmHandler.bind(this, '0')}>{i18n.t('settings.terminate_all_other_sessions')}</span>
                                                        </div>
                                                    );
                                                } else {
                                                    return '';
                                                }
                                            } else {
                                                return (
                                                    <div key={key} className="session-item">
                                                        {Boolean(this.currentAuthID === item.authid) &&
                                                        <div
                                                            className="session-current">{i18n.t('settings.current')}</div>}
                                                        <div className="session-info">
                                                            <div className="session-row">
                                                                <div
                                                                    className="session-col">{`Client: ${(item.model || '').split(':-').join(' ')}`}</div>
                                                            </div>
                                                            <div
                                                                className="session-row">
                                                                <div
                                                                    className="session-col">{i18n.tf('settings.ip_at', [item.clientip || '', TimeUtility.dynamic(item.createdat)])}</div>
                                                            </div>
                                                            <div className="session-row">
                                                                <div
                                                                    className="session-col">{i18n.tf('settings.last_active', TimeUtility.timeAgo(item.activeat))}</div>
                                                            </div>
                                                        </div>
                                                        <div className="session-action">
                                                            <span className="action-terminate"
                                                                  onClick={this.terminateSessionConfirmHandler.bind(this, item.authid)}>{i18n.t('settings.terminate')}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </Scrollbars>}
                                {Boolean(sessions.length === 0) &&
                                <div
                                    className="session-placeholder">{i18n.t('settings.you_have_no_active_sessions')}</div>}
                            </div>}
                            {loading && <Loading/>}
                        </React.Fragment>}
                        {Boolean(pageContent === 'storage') && <React.Fragment>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>{i18n.t('settings.data_and_storage')}</label>
                            </div>
                            <div className="menu-content">
                                <Scrollbars autoHide={true}>
                                    <div>
                                        {storageItems.map((item) => {
                                            if (item.type === 'item') {
                                                return (
                                                    <div key={item.id}
                                                         className={'switch-item ' + (item.className || '')}>
                                                        <div className="switch-label">{i18n.t(item.title)}</div>
                                                        <div className="switch">
                                                            <Switch
                                                                checked={Boolean(this.state.storageValues[item.id] || false)}
                                                                className={'setting-switch' + (this.state.storageValues[item.id] ? ' checked' : '')}
                                                                color="default"
                                                                onChange={this.storageToggleHandler.bind(this, item.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            } else if (item.type === 'header') {
                                                return (
                                                    <div key={item.id}
                                                         className={'sub-page-header ' + (item.className || '')}
                                                    >{i18n.t(item.title)}</div>
                                                );
                                            } else {
                                                return '';
                                            }
                                        })}
                                    </div>
                                    <div className="settings-btn"
                                         onClick={this.storageUsageHandler}>{i18n.t('settings.storage_usage')}</div>
                                </Scrollbars>
                            </div>
                        </React.Fragment>}
                        {Boolean(pageContent === 'language') && <React.Fragment>
                            <div className="menu-header">
                                <IconButton
                                    aria-label="Prev"
                                    aria-haspopup="true"
                                    onClick={this.onPrevHandler}
                                >
                                    <KeyboardBackspaceRounded/>
                                </IconButton>
                                <label>{i18n.t('settings.language')}</label>
                            </div>
                            <div className="menu-content">
                                <Scrollbars
                                    autoHide={true}
                                >
                                    <div className="info language-list">
                                        {languageList.map((item, key) => {
                                            return (<div key={key} className="language-item"
                                                         onClick={this.changeLanguage.bind(this, item.lang)}>
                                                <div className="language-label">{item.title}</div>
                                                <div className="check">
                                                    {item.lang === this.state.selectedLanguage && <DoneRounded/>}
                                                </div>
                                            </div>);
                                        })}
                                    </div>
                                </Scrollbars>
                            </div>
                        </React.Fragment>}
                    </div>
                </div>
                <Menu
                    anchorEl={avatarMenuAnchorEl}
                    open={Boolean(avatarMenuAnchorEl)}
                    onClose={this.avatarMenuAnchorCloseHandler}
                    className="kk-context-menu"
                >
                    {this.avatarContextMenuItem()}
                </Menu>
                <OverlayDialog
                    open={debugModeOpen}
                    onClose={this.debugModeCloseHandler}
                    className="confirm-dialog"
                    disableBackdropClick={true}
                >
                    <div>
                        <DialogTitle>{i18n.t('settings.debug_mode')}</DialogTitle>
                        <DialogContent>
                            <div style={{width: '300px'}}>
                                <DialogContentText>{i18n.t('settings.set_test_url')}</DialogContentText>
                                <TextField
                                    autoFocus={true}
                                    margin="dense"
                                    label={i18n.t('settings.test_url')}
                                    type="text"
                                    fullWidth={true}
                                    value={this.state.debugModeUrl}
                                    onChange={this.debugModeUrlChange}
                                />
                                <TextField
                                    autoFocus={true}
                                    margin="dense"
                                    label={i18n.t('settings.throttle_interval')}
                                    type="text"
                                    fullWidth={true}
                                    value={this.state.debugThrottleInterval}
                                    onChange={this.debugModeThrottleIntervalChange}
                                />
                                <Button onClick={this.debugModeClearAllDataHandler} variant="raised" color="secondary"
                                        fullWidth={true}>{i18n.t('settings.clear_all_data')}</Button>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.debugModeCloseHandler} color="secondary">
                                {i18n.t('general.cancel')}
                            </Button>
                            <Button onClick={this.debugModeApplyHandler} color="primary" autoFocus={true}>
                                {i18n.t('general.apply')}
                            </Button>
                        </DialogActions>
                    </div>
                </OverlayDialog>
                <OverlayDialog
                    open={confirmDialogOpen}
                    onClose={this.confirmDialogCloseHandler}
                    className="confirm-dialog"
                >
                    <DialogTitle>{this.state.confirmDialogSelectedId === '0' ? i18n.t('settings.terminate_all_other_sessions') : i18n.t('settings.terminate_session')}</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.confirmDialogCloseHandler} color="secondary">
                            {i18n.t('general.disagree')}
                        </Button>
                        <Button onClick={this.terminateSessionHandler} color="primary" autoFocus={true}>
                            {i18n.t('general.agree')}
                        </Button>
                    </DialogActions>
                </OverlayDialog>
            </div>
        );
    }

    private changeLanguage = (lang: string) => {
        const l = localStorage.getItem('river.lang');
        if (l !== lang) {
            // @ts-ignore
            const selectedLang = find(languageList, {lang});
            localStorage.setItem('river.lang', lang);
            if (selectedLang) {
                localStorage.setItem('river.lang.dir', selectedLang.dir);
            }
            this.setState({
                selectedLanguage: lang,
            });
            window.location.reload();
        }
    }

    /* Dark mode change handler */
    private nightModeHandler = (e: any) => {
        this.setState({
            selectedTheme: e.currentTarget.checked ? 'dark' : 'light',
        }, () => {
            this.applyTheme();
        });
    }

    /* Apply theme in both localStorage and DOM */
    private applyTheme() {
        const el = document.querySelector('html');
        if (!el) {
            return;
        }
        el.setAttribute('theme', this.state.selectedTheme);
        localStorage.setItem('river.theme.color', this.state.selectedTheme);
        this.broadcastEvent('Theme_Changed', null);
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

    private fontSizeChangeHandler = (e: any, value: number) => {
        this.setState({
            fontSize: value,
        });
    }

    private changeFontSize() {
        if (this.props.updateMessages) {
            this.props.updateMessages(true);
        }
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

    private selectPageHandler = (target: string) => {
        this.setState({
            page: '2',
            pageContent: target,
        }, () => {
            this.dispatchSubPlaceChange();
        });
        if (target === 'session') {
            this.getSessions();
        }
    }

    private getUser() {
        this.userRepo.get(this.userId).then((res) => {
            if (res) {
                return res;
            } else {
                const inputUser = new InputUser();
                inputUser.setAccesshash('0');
                inputUser.setUserid(this.userId);
                return this.sdk.getUserFull([inputUser]).then((data) => {
                    const index = findIndex(data.usersList, {id: this.userId});
                    if (index > -1) {
                        return data.usersList[index];
                    } else {
                        throw new Error('user not found');
                    }
                });
            }
        }).then((res) => {
            this.setState({
                bio: res.bio || '',
                firstname: res.firstname || '',
                lastname: res.lastname || '',
                user: res,
                username: res.username || '',
            });
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

    private onBioChangeHandler = (e: any) => {
        this.setState({
            bio: e.currentTarget.value,
        });
    }

    private onUsernameChangeHandler = (e: any) => {
        const username = e.currentTarget.value;
        if (username.length === 0) {
            this.setState({
                username,
                usernameAvailable: true,
                usernameValid: true,
            });
            return;
        }
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

    private selectThemeHandler = (id: string) => {
        this.setState({
            selectedTheme: id,
        }, () => {
            this.applyTheme();
        });
    }

    private selectBackgroundHandler = (id: string) => {
        if (id === C_CUSTOM_BG) {
            this.settingsBackgroundModalRef.openDialog();
        } else {
            this.backgroundService.disable();
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
    }

    private selectBgTypeHandler = (id: string) => {
        if (id === '1') {
            this.settingsBackgroundModalRef.openDialog();
        } else {
            this.backgroundService.disable();
        }
        if (id === '2') {
            this.settingsBackgroundModalRef.openDialog(true);
        }
        if (id === '0') {
            this.selectBackgroundHandler('0');
        }
        this.setState({
            selectedBgType: id,
        });
    }

    private selectBubbleHandler = (id: string) => {
        if (this.props.updateMessages) {
            this.props.updateMessages(true);
        }
        this.setState({
            selectedBubble: id,
        }, () => {
            const el = document.querySelector('html');
            if (!el) {
                return;
            }
            localStorage.setItem('river.theme.bubble', id);
            el.setAttribute('bubble', id);
            if (this.props.updateMessages) {
                this.props.updateMessages();
            }
            this.userRepo.setBubbleMode(id);
            this.broadcastEvent('Theme_Changed', null);
        });
    }

    private confirmProfileChangesHandler = () => {
        const {firstname, lastname, bio, user} = this.state;
        if (!user) {
            return;
        }
        this.sdk.updateProfile(firstname, lastname, bio).then(() => {
            user.firstname = firstname;
            user.lastname = lastname;
            user.bio = bio;
            this.setState({
                bio: user.bio || '',
                editProfile: false,
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                user,
            });
            this.userRepo.importBulk(false, [user]);
        }).catch(() => {
            this.setState({
                bio: '',
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
            this.userRepo.importBulk(false, [user]);
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

    /* Cancel handler */
    private cancelHandler = () => {
        const {user} = this.state;
        if (!user) {
            return;
        }
        this.setState({
            editProfile: false,
            editUsername: false,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            user,
            username: user.username || '',
        });
    }

    /* Cropper ref handler */
    private cropperRefHandler = (ref: any) => {
        this.cropperRef = ref;
    }

    /* Open file dialog */
    private openFileDialog = () => {
        if (this.cropperRef) {
            this.cropperRef.openFile();
        }
    }

    /* Cropped image ready handler */
    private croppedImageReadyHandler = (blob: Blob) => {
        const id = -this.riverTime.milliNow();
        this.fileId = String(UniqueId.getRandomId());
        const fn = this.progressBroadcaster.listen(id, this.uploadProgressHandler);
        if (this.profileTempPhoto !== '') {
            URL.revokeObjectURL(this.profileTempPhoto);
        }
        this.profileTempPhoto = URL.createObjectURL(blob);
        this.setState({
            uploadingPhoto: true,
        });
        this.fileManager.sendFile(this.fileId, blob, (progress) => {
            this.progressBroadcaster.publish(id, progress);
        }).then(() => {
            this.progressBroadcaster.remove(id);
            if (fn) {
                fn();
            }
            const inputFile = new InputFile();
            inputFile.setFileid(this.fileId);
            inputFile.setFilename(`picture_${id}.ogg`);
            inputFile.setMd5checksum('');
            inputFile.setTotalparts(1);
            this.sdk.uploadProfilePicture(inputFile).then((res) => {
                this.setState({
                    uploadingPhoto: false,
                });
            });
        }).catch(() => {
            this.progressBroadcaster.remove(id);
            this.setState({
                uploadingPhoto: false,
            });
            if (fn) {
                fn();
            }
        });
    }

    /* Upload progress handler */
    private uploadProgressHandler = (progress: IFileProgress) => {
        let v = 3;
        if (progress.state === 'failed') {
            this.setState({
                uploadingPhoto: false,
            });
            return;
        } else if (progress.state !== 'complete' && progress.download > 0) {
            v = progress.progress * 85;
        } else if (progress.state === 'complete') {
            v = 88;
        }
        if (v < 3) {
            v = 3;
        }
        if (this.circleProgressRef) {
            this.circleProgressRef.style.strokeDasharray = `${v} 88`;
        }
    }

    /* Progress circle ref handler */
    private progressRefHandler = (ref: any) => {
        this.circleProgressRef = ref;
    }

    /* Cancel file download/upload */
    private cancelFileHandler = () => {
        this.fileManager.cancel(this.fileId);
    }

    /* Avatar menu anchor close handler */
    private avatarMenuAnchorCloseHandler = () => {
        this.setState({
            avatarMenuAnchorEl: null,
        });
    }

    /* Avatar menu anchor open handler */
    private avatarMenuAnchorOpenHandler = (e: any) => {
        this.setState({
            avatarMenuAnchorEl: e.currentTarget,
        });
    }

    /* Decides what content the participants' "more" menu must have */
    private avatarContextMenuItem() {
        const menuItems = [{
            cmd: 'show',
            title: i18n.t('settings.show_photo'),
        }, {
            cmd: 'remove',
            title: i18n.t('settings.remove_photo'),
        }, {
            cmd: 'change',
            title: i18n.t('settings.change_photo'),
        }];
        return menuItems.map((item, index) => {
            return (<MenuItem key={index} onClick={this.avatarMoreCmdHandler.bind(this, item.cmd)}
                              className="context-item">{item.title}</MenuItem>);
        });
    }

    private avatarMoreCmdHandler = (cmd: 'show' | 'remove' | 'change') => {
        switch (cmd) {
            case 'show':
                this.showAvatarHandler();
                break;
            case 'remove':
                this.sdk.removeProfilePicture().then(() => {
                    //
                });
                break;
            case 'change':
                this.openFileDialog();
                break;
        }
        this.avatarMenuAnchorCloseHandler();
    }

    /* Show avatar handler */
    private showAvatarHandler = () => {
        const {user} = this.state;
        if (!user || !user.photo) {
            return;
        }
        const doc: IDocument = {
            items: [{
                caption: '',
                fileLocation: user.photo.photobig,
                thumbFileLocation: user.photo.photosmall,
            }],
            type: 'avatar'
        };
        this.documentViewerService.loadDocument(doc);
    }

    /* Version click handler */
    private versionClickHandler = () => {
        if (!this.versionClickTimeout) {
            this.versionClickTimeout = setTimeout(() => {
                clearTimeout(this.versionClickTimeout);
                this.versionClickTimeout = null;
                this.versionClickCounter = 0;
            }, 6000);
        }
        this.versionClickCounter++;
        if (this.versionClickCounter >= 10) {
            clearTimeout(this.versionClickTimeout);
            this.versionClickTimeout = null;
            this.versionClickCounter = 0;
            this.setState({
                debugModeOpen: true,
            });
        }
    }

    private debugModeClearAllDataHandler = () => {
        const authErrorEvent = new CustomEvent('authErrorEvent', {});
        window.dispatchEvent(authErrorEvent);
    }

    /* Debug mode close handler */
    private debugModeCloseHandler = () => {
        this.setState({
            debugModeOpen: false,
        });
    }

    /* Debug mode apply handler */
    private debugModeApplyHandler = () => {
        localStorage.setItem('river.workspace_url', this.state.debugModeUrl);
        localStorage.setItem('river.debug.throttle_interval', String(this.state.debugThrottleInterval));
        window.location.reload();
    }

    /* Debug mode url change handler */
    private debugModeUrlChange = (e: any) => {
        this.setState({
            debugModeUrl: e.currentTarget.value,
        });
    }

    /* Debug mode Throttle Interval change handler */
    private debugModeThrottleIntervalChange = (e: any) => {
        this.setState({
            debugThrottleInterval: e.currentTarget.value,
        });
    }

    /* Logout handler */
    private logOutHandler = () => {
        if (this.props.onAction) {
            this.props.onAction('logout');
        }
    }

    /* Modify Sessions */
    private modifySessions(sessions: AccountAuthorization.AsObject[]) {
        const index = findIndex(sessions, {authid: this.currentAuthID});
        if (index > 0) {
            const currentSession = sessions[index];
            sessions.splice(index, 1);
            // @ts-ignore
            sessions.unshift({type: 'terminate_all'});
            sessions.unshift(currentSession);
        } else {
            // @ts-ignore
            sessions.splice(1, 0, {type: 'terminate_all'});
        }
        return sessions;
    }

    /* Get All Sessions */
    private getSessions() {
        if (this.state.loading) {
            return;
        }
        this.setState({
            loading: true,
        });

        this.sdk.sessionGetAll().then((res) => {
            this.setState({
                loading: false,
                sessions: this.modifySessions(res.authorizationsList),
            });
        }).catch(() => {
            this.setState({
                loading: false,
            });
        });
    }

    /* Open confirm dialog for terminate session by Id */
    private terminateSessionConfirmHandler(id: string) {
        this.setState({
            confirmDialogOpen: true,
            confirmDialogSelectedId: id
        });
    }

    /* Terminate session selected session */
    private terminateSessionHandler = () => {
        const {confirmDialogSelectedId} = this.state;
        if (confirmDialogSelectedId !== '') {
            this.sdk.sessionTerminate(confirmDialogSelectedId).then(() => {
                const {sessions} = this.state;
                if (confirmDialogSelectedId !== '0') {
                    const index = findIndex(sessions, {authid: confirmDialogSelectedId});
                    if (sessions && index > -1) {
                        sessions.splice(index, 1);
                        this.setState({
                            sessions,
                        });
                    }
                } else {
                    const index = findIndex(sessions, {authid: this.currentAuthID});
                    if (sessions && index > -1) {
                        this.setState({
                            sessions: [sessions[index]],
                        });
                    }
                }
            });
        }
        this.confirmDialogCloseHandler();
    }

    /* Confirm dialog close handler */
    private confirmDialogCloseHandler = () => {
        this.setState({
            confirmDialogOpen: false,
        });
    }

    /* Broadcast Global Event */
    private broadcastEvent(name: string, data: any) {
        this.broadcaster.publish(name, data);
    }

    private settingsBackgroundModalRefHandler = (ref: any) => {
        this.settingsBackgroundModalRef = ref;
    }

    private settingsStorageUsageModalRefHandler = (ref: any) => {
        this.settingsStorageUsageModalRef = ref;
    }

    private settingsBackgroundModalDoneHandler = (data: ICustomBackground) => {
        const {customBackgroundSrc} = this.state;
        if (customBackgroundSrc) {
            URL.revokeObjectURL(customBackgroundSrc);
        }
        this.setState({
            customBackgroundSrc: URL.createObjectURL(data.blob),
            selectedCustomBackground: data.id,
            selectedCustomBackgroundBlur: data.blur,
            selectedTheme: C_CUSTOM_BG,
        });
        this.fileRepo.upsertFile(C_CUSTOM_BG_ID, data.blob).then(() => {
            localStorage.setItem('river.theme.bg.pic', data.id);
            localStorage.setItem('river.theme.bg.blur', String(data.blur));
            localStorage.setItem('river.theme.bg', C_CUSTOM_BG);
            const el = document.querySelector('html');
            if (el) {
                el.setAttribute('bg', C_CUSTOM_BG);
            }
            this.backgroundService.setBackground(data.blob);
        });
    }

    private storageToggleHandler = (id: string, e: any) => {
        const {storageValues} = this.state;
        storageValues[id] = e.target.checked;
        if (id === 'download_all') {
            for (const i in storageValues) {
                if (i !== 'download_all') {
                    storageValues[i] = storageValues[id];
                }
            }
        }
        this.downloadManger.setDownloadSettings(Object.assign({}, storageValues));
        this.setState({
            storageValues,
        });
    }

    private storageUsageHandler = () => {
        if (!this.settingsStorageUsageModalRef) {
            return;
        }
        this.settingsStorageUsageModalRef.openDialog();
    }
}

export default SettingsMenu;
