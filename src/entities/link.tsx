import {ContentBlock, ContentState} from 'draft-js';
import * as React from 'react';

import {EntityTypes} from '../util/constants';

export const findLinkEntities = (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();

            return entityKey !== null && contentState.getEntity(entityKey).getType() === EntityTypes.LINK;
        },
        callback
    );
};

interface Props {
    contentState: ContentState;
    entityKey: string;
    children: React.ReactNode;
}

const Link = (props: Props) => {
    const {contentState, entityKey} = props;
    const {url} = contentState.getEntity(entityKey).getData();

    return (
        <a
            className="md-link"
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={url}
        >{props.children}</a>
    );
};

export default Link;
