/*
    Creation Time: 2018 - Aug - 18
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import * as React from 'react';
import Routes from './app/routes';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MainRepo from './app/repository';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {ErrorInfo} from 'react';
import * as Sentry from '@sentry/browser';
import I18n from "./app/services/i18n";
import IframeService, {C_IFRAME_SUBJECT} from "./app/services/iframe";
import UniqueId from "./app/services/uniqueId";
import {C_VERSION} from "./app/components/SettingsMenu";
import Server from "./app/services/sdk/server";

import './App.css';

if (!process || !process.env || process.env.NODE_ENV !== 'development') {
    Sentry.init({
        dsn: "https://7f5b41c4b12d473bbe8db09fe0420c8a@sentry.ronaksoftware.com/8"
    });
}

const theme = createMuiTheme({
    palette: {
        primary: {
            contrastText: '#FFF',
            dark: '#2E8F57',
            light: '#29c16d',
            main: '#27AE60',
        },
    },
    typography: {
        fontFamily: "'YekanBakh', 'OpenSans'",
    },
});

interface IState {
    alertOpen: boolean;
    clearingSiteData: boolean;
    errorMessage: string;
}

I18n.init({
    defLang: localStorage.getItem('river.lang') || 'en',
    dictionaries: {
        en: require('./app/locales/en.json'),
        fa: require('./app/locales/fa.json'),
    },
});

class App extends React.Component<{}, IState> {
    private mainRepo: MainRepo;
    private readonly isElectron: boolean = false;
    private iframeService: IframeService;
    private readonly broadcastChannel: BroadcastChannel;
    private readonly sessionId: number = 0;
    private multipleSession: boolean = false;
    private sessionsIds: number[] = [];

    constructor(props: {}) {
        super(props);

        this.state = {
            alertOpen: false,
            clearingSiteData: false,
            errorMessage: `You are receiving "Auth Error", do you like to clear all site data?`,
        };

        this.mainRepo = MainRepo.getInstance();

        // @ts-ignore
        if (window.isElectron) {
            this.isElectron = true;
        }

        this.iframeService = IframeService.getInstance();

        this.sessionId = UniqueId.getRandomId();
        if (BroadcastChannel) {
            this.broadcastChannel = new BroadcastChannel('river_channel');
        }
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (!process || !process.env || process.env.NODE_ENV !== 'development') {
            Sentry.withScope((scope) => {
                scope.setExtras(errorInfo);
                const eventId = Sentry.captureException(error);
                Sentry.showReportDialog({eventId});
            });
        }
    }

    public componentDidMount() {
        document.addEventListener('drop', (e) => e.preventDefault(), false);
        document.addEventListener('dragover', (e) => e.preventDefault(), false);
        window.addEventListener('focus', this.windowFocusHandler);
        window.addEventListener('blur', this.windowBlurHandler);
        window.addEventListener('beforeunload', this.windowBeforeUnloadHandler);
        window.addEventListener('authErrorEvent', (event: any) => {
            this.setState({
                alertOpen: true,
                errorMessage: `You are receiving "Auth Error", do you like to clear all site data?`,
            });
        });

        window.addEventListener('fnDecryptError', (event: any) => {
            this.setState({
                alertOpen: true,
                errorMessage: `You are receiving "Decrypt Error", do you like to clear all site data?`,
            });
        });

        const el = document.querySelector('html');
        if (el) {
            el.setAttribute('theme', localStorage.getItem('river.theme.color') || 'light');
            el.setAttribute('font', localStorage.getItem('river.theme.font') || '2');
            el.setAttribute('bg', localStorage.getItem('river.theme.bg') || '2');
            el.setAttribute('bubble', localStorage.getItem('river.theme.bubble') || '4');
            el.setAttribute('direction', localStorage.getItem('river.lang.dir') || 'ltr');
        }

        const refreshEl = document.querySelector('#refresh');
        if (refreshEl) {
            refreshEl.remove();
        }

        // @ts-ignore
        if (window.clearLoading) {
            // @ts-ignore
            window.clearLoading();
        }

        this.iframeService.listen(C_IFRAME_SUBJECT.IsLoaded, (e) => {
            this.iframeService.loaded(e.reqId);
        });

        if (this.broadcastChannel) {
            this.broadcastChannel.addEventListener('message', this.channelMessageHandler);
            this.sendSessionMessage('loaded', {version: C_VERSION});
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('focus', this.windowFocusHandler);
        window.removeEventListener('blur', this.windowBlurHandler);

        if (this.broadcastChannel) {
            this.broadcastChannel.removeEventListener('message', this.channelMessageHandler);
            this.broadcastChannel.close();
        }
    }

    public render() {
        const {alertOpen, clearingSiteData, errorMessage} = this.state;
        return (
            <div className={'App' + (this.isElectron ? ' is-electron' : '')}>
                <MuiThemeProvider theme={theme}>
                    {Routes}
                </MuiThemeProvider>
                <Dialog
                    open={alertOpen}
                    onClose={this.alertCloseHandler}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Critical Error</DialogTitle>
                    <DialogContent>
                        {!clearingSiteData && <DialogContentText>
                            {errorMessage}<br/>
                            <i>This probably fix your problem!</i>
                        </DialogContentText>}
                    </DialogContent>
                    {!clearingSiteData && <DialogActions>
                        <Button onClick={this.alertCloseHandler} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.clearSiteDataHandler} color="primary" autoFocus={true}>
                            Agree
                        </Button>
                    </DialogActions>}
                    {clearingSiteData &&
                    <DialogActions style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress/>
                    </DialogActions>}
                </Dialog>
            </div>
        );
    }

    private alertCloseHandler = () => {
        this.setState({
            alertOpen: false,
        });
    }

    private clearSiteDataHandler = () => {
        this.setState({
            clearingSiteData: true,
        });
        this.mainRepo.destroyDB().then(() => {
            const testUrl = localStorage.getItem('river.workspace_url') || '';
            localStorage.clear();
            localStorage.setItem('river.workspace_url', testUrl);
            this.setState({
                alertOpen: false,
            }, () => {
                window.location.reload();
            });
        });
    }

    private channelMessageHandler = (e: any) => {
        const data = e.data;
        if (data.uuid === this.sessionId) {
            return;
        }
        switch (data.cmd) {
            case 'loaded':
                Server.getInstance().stopNetwork();
                IframeService.getInstance().newSession();
                this.multipleSession = true;
                if (this.sessionsIds.indexOf(data.uuid) === -1) {
                    this.sessionsIds.push(data.uuid);
                }
                this.sendSessionMessage('loaded_res', {id: this.sessionId});
                break;
            case 'loaded_res':
                if (data.payload.id === this.sessionId) {
                    this.multipleSession = true;
                    if (this.sessionsIds.indexOf(data.uuid) === -1) {
                        this.sessionsIds.push(data.uuid);
                    }
                }
                break;
            case 'close_session':
                const index = this.sessionsIds.indexOf(data.uuid);
                if (index > -1) {
                    this.sessionsIds.splice(index, 1);
                }
                if (this.sessionsIds.length === 0) {
                    this.multipleSession = false;
                }
                break;
        }
    }

    private windowFocusHandler = () => {
        if (!this.multipleSession) {
            return;
        }
        Server.getInstance().startNetwork();
    }

    private windowBlurHandler = () => {
        if (!this.multipleSession) {
            return;
        }
        Server.getInstance().stopNetwork();
    }

    private windowBeforeUnloadHandler = () => {
        this.sendSessionMessage('close_session', {});
    }

    private sendSessionMessage(cmd: string, payload: any) {
        if (!this.broadcastChannel) {
            return;
        }
        this.broadcastChannel.postMessage({
            cmd,
            payload,
            uuid: this.sessionId,
        });
    }
}

export default App;
