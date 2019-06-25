import * as React from 'react';
import {EditorBlock, EditorState, SelectionState} from 'draft-js';
import {getCurrentBlock} from '../model';
import {BlockProps} from '../typings';

export class ImageBlock extends React.PureComponent<BlockProps> {

    public render() {
        const {block} = this.props;
        const data = block.getData();
        const src = data.get('src');

        if (src !== null) {
            return (
                <>
                    <div className="md-block-image-inner-container" onClick={this.focusBlock}>
                        <img role="presentation" src={src} alt="" className="md-block-image-inner-container--image"/>
                    </div>
                    <figcaption>
                        <EditorBlock {...this.props} />
                    </figcaption>
                </>
            );
        }

        return <EditorBlock {...this.props} />;
    }

    private focusBlock = () => {
        const {block, blockProps} = this.props;
        const {getEditorState, setEditorState} = blockProps;
        const key = block.getKey();
        const editorState = getEditorState();
        const currentBlock = getCurrentBlock(editorState);

        if (currentBlock.getKey() === key) {
            return;
        }

        const newSelection = new SelectionState({
            anchorKey: key,
            focusKey: key,
            anchorOffset: 0,
            focusOffset: 0,
        });

        setEditorState(EditorState.forceSelection(editorState, newSelection));
    }
}
