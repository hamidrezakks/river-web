/*
    Creation Time: 2019 - May - 29
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2019
*/

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
// @ts-ignore
import riverLogo from '../../../asset/image/about/river.png';
// @ts-ignore
import ronakLogo from '../../../asset/image/about/ronak.png';
import {C_VERSION} from "../SettingsMenu";

import './style.css';

interface IProps {
    height?: string;
}

interface IState {
    className?: string;
    open: boolean;
}

class AboutDialog extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            open: false,
        };

    }

    public componentDidMount() {
        //
    }

    public openDialog() {
        this.setState({
            open: true,
        });
    }

    public render() {
        const {open} = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.closeHandler}
                className="about-dialog"
            >
                <div className="about-dialog-content">
                    <div className="logo-container">
                        <img src={riverLogo}/>
                    </div>
                    <div className="version-container">{C_VERSION}</div>
                    <div className="about-container">
                        River is free messaging app for desktop focuses on security and speed.
                    </div>
                    <div className="copyright-container">
                        <img src={ronakLogo}/>
                        <span>Copyright © 2016 - 2019 Ronak Software Group</span>
                    </div>
                </div>
            </Dialog>
        );
    }

    private closeHandler = () => {
        this.setState({
            open: false,
        });
    }

}

export default AboutDialog;
