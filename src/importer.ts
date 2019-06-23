import {convertFromHTML, ConvertFromHTMLOptions, EntityKey} from 'draft-convert';
import {Block, Entity as EntityType, Inline} from './util/constants';
import {ContentState, DraftInlineStyle} from 'draft-js';

export const htmlToStyle = (nodeName: string, node: HTMLElement, currentStyle: DraftInlineStyle) => {
    switch (nodeName) {
        case 'em':
            return currentStyle.add(Inline.ITALIC);

        case 'strong':
            return currentStyle.add(Inline.BOLD);

        case 'strike':
            return currentStyle.add(Inline.STRIKETHROUGH);

        case 'u':
            return currentStyle.add(Inline.UNDERLINE);

        case 'span':
            if (node.className === `md-inline-${Inline.HIGHLIGHT.toLowerCase()}`) {
                return currentStyle.add(Inline.HIGHLIGHT);
            }
            break;

        case 'code':
            return currentStyle.add(Inline.CODE);

        default:
            break;
    }

    return currentStyle;
};

export const htmlToEntity = (nodeName: string, node: HTMLElement, createEntity: (type: string, mutability: string, data: object) => EntityKey) => {
    if (nodeName === 'a') {
        const hrefNode = node as HTMLAnchorElement;

        return createEntity(EntityType.LINK, 'MUTABLE', {url: hrefNode.href});
    }

    return undefined;
};

export const htmlToBlock = (nodeName: string, node: HTMLElement) => {
    if (nodeName === 'h1') {
        return {
            type: Block.H1,
            data: {},
        };
    } else if (nodeName === 'h2') {
        return {
            type: Block.H2,
            data: {},
        };
    } else if (nodeName === 'h3') {
        return {
            type: Block.H3,
            data: {},
        };
    } else if (nodeName === 'h4') {
        return {
            type: Block.H4,
            data: {},
        };
    } else if (nodeName === 'h5') {
        return {
            type: Block.H5,
            data: {},
        };
    } else if (nodeName === 'h6') {
        return {
            type: Block.H6,
            data: {},
        };
    } else if (nodeName === 'p' && (
        node.className === `md-block-${Block.CAPTION.toLowerCase()}` ||
        node.className === `md-block-${Block.BLOCKQUOTE_CAPTION.toLowerCase()}`)) {
        return {
            type: Block.BLOCKQUOTE_CAPTION,
            data: {},
        };
    } else if (nodeName === 'figure') {
        if (node.className.match(/^md-block-image/)) {
            const imageNode = node.querySelector('img');

            return {
                type: Block.IMAGE,
                data: {
                    src: imageNode && imageNode.src,
                },
            };
        } else if (node.className === `md-block-${Block.ATOMIC.toLowerCase()}`) {
            return {
                type: Block.ATOMIC,
                data: {},
            };
        }

        return undefined;
    } else if (nodeName === 'hr') {
        return {
            type: Block.BREAK,
            data: {},
        };
    } else if (nodeName === 'blockquote') {
        return {
            type: Block.BLOCKQUOTE,
            data: {},
        };
    } else if (nodeName === 'p') {
        return {
            type: Block.UNSTYLED,
            data: {},
        };
    } else if (['div', 'pre'].includes(nodeName) && node.className === 'md-block-code-container') {
        return {
            type: Block.CODE,
            data: {},
        };
    }

    return undefined;
};

export const options: ConvertFromHTMLOptions = {
    htmlToStyle,
    htmlToEntity,
    htmlToBlock,
};

export function setImportOptions(htmlOptions: ConvertFromHTMLOptions = options) {
    return convertFromHTML(htmlOptions);
}

export function toState(rawHTML: string, htmlOptions: ConvertFromHTMLOptions = options): ContentState {
    return convertFromHTML(htmlOptions)(rawHTML);
}
