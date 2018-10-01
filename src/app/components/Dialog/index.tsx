import * as React from 'react';
import {List, CellMeasurer, CellMeasurerCache} from 'react-virtualized';
import {Link} from 'react-router-dom';
import * as _ from 'lodash';
import './style.css';
import {IDialog} from "../../repository/dialog/interface";
import DialogMessage from "../DialogMessage";

interface IProps {
    items: IDialog[];
    selectedId: number;
}

interface IState {
    items: IDialog[];
    selectedId: number;
    scrollIndex: number;
}

class Dialog extends React.Component<IProps, IState> {
    private list: any;
    private cache: any;

    constructor(props: IProps) {
        super(props);

        this.state = {
            items: props.items,
            scrollIndex: -1,
            selectedId: props.selectedId,
        };
        window.console.log(this.list);
        this.cache = new CellMeasurerCache({
            fixedWidth: true,
            minHeight: 25,
        });
    }

    public componentWillReceiveProps(newProps: IProps) {
        if (this.state.items !== newProps.items) {
            this.setState({
                items: newProps.items,
                scrollIndex: -1,
                selectedId: newProps.selectedId,
            }, () => {
                this.list.recomputeRowHeights();
            });
        } else {
            // @ts-ignore
            const index = _.findIndex(this.state.items, {id: newProps.selectedId});
            this.setState({
                scrollIndex: index,
                selectedId: newProps.selectedId,
            }, () => {
                this.list.recomputeRowHeights();
            });
        }
    }

    public render() {
        const {items} = this.state;
        return (
            <List
                ref={this.refHandler}
                deferredMeasurementCache={this.cache}
                rowHeight={this.cache.rowHeight}
                rowRenderer={this.rowRender}
                rowCount={items.length}
                overscanRowCount={0}
                scrollToIndex={this.state.scrollIndex}
                width={318}
                height={550}
                className="people"
            />
        );
    }

    private refHandler = (value: any) => {
        this.list = value;
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
                <div style={style} key={index}>
                    <Link to={`/conversation/${data.peerid}`}>
                        <div className={'dialog' + (data.peerid === this.state.selectedId ? ' active' : '')}>
                            <DialogMessage messageId={data.topmessageid || -1}/>
                        </div>
                    </Link>
                </div>
            </CellMeasurer>
        );
    }
}

export default Dialog;