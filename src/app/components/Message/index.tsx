import * as React from 'react';
import {List, CellMeasurer, CellMeasurerCache, AutoSizer} from 'react-virtualized';
import {IMessage} from '../../repository/message/interface';
import './style.css';

interface IProps {
    items: IMessage[];
    rendered?: () => void;
}

interface IState {
    items: IMessage[];
    scrollIndex: number;
    listStyle?: React.CSSProperties;
}

class Message extends React.Component<IProps, IState> {
    private list: any;
    private cache: any;
    private listCount: number;

    constructor(props: IProps) {
        super(props);

        this.state = {
            items: props.items,
            scrollIndex: -1,
        };
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 25,
        });
        window.console.log(this.list);
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (this.state.items !== newProps.items) {
            this.setState({
                items: newProps.items,
                scrollIndex: newProps.items.length - 1,
            }, () => {
                this.fitList();
            });
            this.listCount = newProps.items.length;
        } else if (this.state.items === newProps.items &&
            newProps.items.length > 2 && this.listCount < newProps.items.length) {
            this.setState({
                scrollIndex: this.listCount - 2,
            }, () => {
                this.fitList();
            });
            this.listCount = newProps.items.length;
        }
    }

    public render() {
        const {items} = this.state;
        return (
            <AutoSizer>
                {({width, height}: any) => (
                    <List
                        ref={this.refHandler}
                        deferredMeasurementCache={this.cache}
                        rowHeight={this.cache.rowHeight}
                        rowRenderer={this.rowRender}
                        rowCount={items.length}
                        overscanRowCount={5}
                        width={width}
                        height={height}
                        scrollToIndex={this.state.scrollIndex}
                        onRowsRendered={this.props.rendered}
                        style={this.state.listStyle}
                        className="chat active-chat"
                    />
                )}
            </AutoSizer>
        );
    }

    private refHandler = (value: any) => {
        this.list = value;
    }

    private formatText(text: string) {
        return text.split('\n').join('<br/>');
    }

    private rowRender = ({index, key, parent, style}: any): any => {
        const data = this.state.items[index];
        return (
            <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                rowIndex={index}
                parent={parent}>
                <div style={style} key={index} className="bubble-wrapper">
                    {(data.avatar && !data.me) && (
                        <span className="avatar">
                            <img src={data.avatar}/>
                        </span>
                    )}
                    <div className={"bubble " + (data.me ? 'me' : 'you')}
                         dangerouslySetInnerHTML={{__html: this.formatText(data.message)}}/>
                </div>
            </CellMeasurer>
        );
    }

    private fitList() {
        setTimeout(() => {
            const list = document.querySelector('.chat.active-chat > div');
            if (list) {
                const diff = this.list.props.height - list.clientHeight;
                if (diff > 0) {
                    this.setState({
                        listStyle: {
                            paddingTop: diff + 'px',
                        },
                    });
                    return;
                }
            }
            this.setState({
                listStyle: {
                    paddingTop: '10px',
                },
            });
        }, 50);
    }
}

export default Message;