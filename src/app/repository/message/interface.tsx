/*
    Creation Time: 2018 - Aug - 25
    Created by:  (hamidrezakk)
    Maintainers:
       1.  HamidrezaKK (hamidrezakks@gmail.com)
    Auditor: HamidrezaKK
    Copyright Ronak Software Group 2018
*/

import {UserMessage} from '../../services/sdk/messages/chat.core.types_pb';

interface IMessage extends UserMessage.AsObject {
    me?: boolean;
    avatar?: boolean;
    rtl?: boolean;
    temp?: boolean;
    actiondata?: any;
    mention_me?: boolean;
    mediadata?: any;
    attributes?: any[];
    error?: boolean;
    downloaded?: boolean;
    saved?: boolean;
    savedPath?: string;
}

interface IPendingMessage {
    id: number;
    message_id: number;
    file_ids?: string[];
    data?: any;
}

export {IMessage, IPendingMessage};
