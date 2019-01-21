import {IMessage} from '../../repository/message/interface';
import {MediaType} from '../../services/sdk/messages/core.types_pb';
import {DocumentAttributeType, MediaDocument} from '../../services/sdk/messages/core.message.medias_pb';
import {C_MESSAGE_TYPE} from '../../repository/message/consts';

export const getMessageTitle = (message: IMessage): string => {
    switch (message.mediatype) {
        default:
        case MediaType.MEDIATYPEEMPTY:
            return (message.body || '').substr(0, 64);
        case MediaType.MEDIATYPEDOCUMENT:
            const messageMediaDocument: MediaDocument.AsObject = message.mediadata;
            if (messageMediaDocument.caption && messageMediaDocument.caption.length > 0) {
                return messageMediaDocument.caption;
            }
            if (message.messagetype === C_MESSAGE_TYPE.Voice) {
                return 'Voice Message';
            } else {
                if (messageMediaDocument.doc.attributesList) {
                    for (let i = 0; i < messageMediaDocument.doc.attributesList.length; i++) {
                        if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTETYPEAUDIO) {
                            return 'Audio Message';
                        } else if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTETYPEVIDEO) {
                            return 'Video Message';
                        } else if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTETYPEPHOTO) {
                            return 'Photo Message';
                        } else if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTETYPEFILE) {
                            return 'File';
                        } else if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTEANIMATED) {
                            return 'GIF';
                        } else if (messageMediaDocument.doc.attributesList[i].type === DocumentAttributeType.ATTRIBUTETYPENONE) {
                            return 'Contact';
                        }
                    }
                }
            }
            return '';
    }
};