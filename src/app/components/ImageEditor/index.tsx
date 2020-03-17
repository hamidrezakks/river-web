/*
    Creation Time: 2020 - March - 15
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2020
*/

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
// @ts-ignore
import ToastImageEditor from '@toast-ui/react-image-editor';
import {CheckRounded, CloseRounded, FullscreenRounded, FullscreenExitRounded} from "@material-ui/icons";

import 'tui-image-editor/dist/tui-image-editor.css';
import './style.scss';

export interface IDimension {
    height: number;
    width: number;
}

interface IProps {
    className?: string;
    onImageReady: (blob: Blob, dimension: IDimension) => void;
}

interface IState {
    className?: string;
    disable: boolean;
    file?: string | null;
    fullscreen: boolean;
    loading: boolean;
    open: boolean;
}

class ImageEditor extends React.Component<IProps, IState> {
    // @ts-ignore
    private imageEditorRef: any | undefined;
    private size: {
        cssHeight: number,
        cssWidth: number,
        height: number,
        width: number,
    } = {
        cssHeight: 568,
        cssWidth: 568,
        height: 600,
        width: 600,
    };

    constructor(props: IProps) {
        super(props);

        this.state = {
            className: props.className || '',
            disable: false,
            file: '',
            fullscreen: false,
            loading: false,
            open: false,
        };

    }

    public componentDidMount() {
        this.setLayoutSize();
    }

    /* Open file dialog */
    public openFile(url: string) {
        this.setLayoutSize();
        this.setState({
            disable: false,
            file: url,
            fullscreen: false,
            loading: false,
            open: true,
        });
    }

    public render() {
        const {disable, open, file, loading, fullscreen} = this.state;
        return (
            <Dialog
                open={open}
                onClose={this.dialogCloseHandler}
                className={'image-editor-dialog' + (fullscreen ? ' fullscreen' : '')}
                classes={{
                    paper: 'image-editor-dialog-paper'
                }}
            >
                <div className="image-editor-dialog-header">
                    Edit Picture
                </div>
                <div className="image-editor-dialog-footer">
                    <div className={'picture-action' + (loading ? ' disabled' : '')} onClick={this.doneHandler}>
                        <CheckRounded/>
                    </div>
                    <div className="picture-action cancel" onClick={this.dialogCloseHandler}>
                        <CloseRounded/>
                    </div>
                    <div className="picture-action maximize" onClick={this.fullscreenToggleHandler}>
                        {fullscreen ? <FullscreenExitRounded/> : <FullscreenRounded/>}
                    </div>
                </div>
                {Boolean(open && !disable) && <ToastImageEditor
                    ref={this.imageEditorRefHandler}
                    includeUI={{
                        loadImage: {
                            name: 'Picture',
                            path: file,
                        },
                        menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'mask', 'filter'],
                        menuBarPosition: 'bottom',
                        uiSize: {
                            height: `${this.size.height}px`,
                            width: `${this.size.width}px`,
                        }
                    }}
                    cssMaxHeight={this.size.cssHeight}
                    cssMaxWidth={this.size.cssWidth}
                    selectionStyle={{
                        cornerSize: 20,
                        rotatingPointOffset: 70
                    }}
                    usageStatistics={true}
                />}
            </Dialog>
        );
    }

    /* Dialog close handler */
    private dialogCloseHandler = () => {
        this.setState({
            disable: false,
            file: null,
            fullscreen: false,
            loading: false,
            open: false,
        });
    }

    private imageEditorRefHandler = (ref: any) => {
        if (!ref) {
            this.imageEditorRef = ref;
            return;
        }
        this.imageEditorRef = ref.getInstance();
    }

    private doneHandler = () => {
        if (!this.imageEditorRef || this.state.loading) {
            return;
        }
        this.setState({
            loading: true,
        });
        const url = this.imageEditorRef.toDataURL();
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const size = this.imageEditorRef.getCanvasSize();
                this.props.onImageReady(blob, {
                    height: size.height,
                    width: size.width,
                });
                URL.revokeObjectURL(url);
                this.dialogCloseHandler();
            });
    }

    private fullscreenToggleHandler = () => {
        this.setLayoutSize(!this.state.fullscreen);
        this.setState({
            disable: true,
            fullscreen: !this.state.fullscreen,
        }, () => {
            this.setState({
                disable: false,
            });
        });
    }

    private setLayoutSize(fullscreen?: boolean) {
        const h = window.innerHeight;
        const w = window.innerWidth;
        if (w <= 640 || fullscreen) {
            this.size = {
                cssHeight: h - 82,
                cssWidth: w - 32,
                height: h,
                width: w,
            };
        } else {
            this.size = {
                cssHeight: 568,
                cssWidth: 568,
                height: 600,
                width: 600,
            };
        }
    }
}

export default ImageEditor;
