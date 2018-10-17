import * as React from 'react';
import TimeUtililty from '../../services/utilities/time';

import './style.css';

interface IProps {
    editedTime: number;
    id?: number;
    readId?: number;
    status: boolean;
    time: number;
}

interface IState {
    editedTime: number;
    id: number;
    readId: number;
    status: boolean;
    time: number;
}

class MessageStatus extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            editedTime: props.editedTime,
            id: props.id || 0,
            readId: props.readId || 0,
            status: props.status,
            time: props.time,
        };
    }

    // public componentDidMount() {
    // }

    public componentWillReceiveProps(newProps: IProps) {
        this.setState({
            editedTime: newProps.editedTime || 0,
            id: newProps.id || 0,
            readId: newProps.readId || 0,
            status: newProps.status,
        });
    }

    public render() {
        const {id, readId, status, time, editedTime} = this.state;
        let cn = 'icon';
        if (id && status) {
            if (id < 0) {
                cn += ' pending';
            } else if (id > 0 && readId >= id) {
                cn += ' double-check';
            } else if (id > 0 && readId < id) {
                cn += ' check';
            }
        }
        return (
            <div className={'message-status'}>
                {editedTime > 0 && <span className="edited">edited</span>}
                <span className="time">{TimeUtililty.TimeParse(time)}</span>
                {status && <span className={cn}/>}
            </div>
        );
    }
}

export default MessageStatus;