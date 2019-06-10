import React from 'react';
import {RichUtils, EditorState} from 'draft-js';
import {ToolbarButton} from './ToolbarButton';
import {ToolbarButtonInterface} from './Toolbar';

interface BlockButtonsBar {
    buttons: ToolbarButtonInterface[];
    editorState: EditorState;
    onToggle: (blockType: string) => void;
}

export const BlockButtonsBar: React.FunctionComponent<BlockButtonsBar> = (props) => {
    if (props.buttons.length < 1) {
        return null;
    }
    const {editorState} = props;
    const blockType = RichUtils.getCurrentBlockType(editorState);
    return (
        <div className="md-RichEditor-controls md-RichEditor-controls-block">
            {props.buttons.map((button) => {
                return (
                    <ToolbarButton
                        label={button.label}
                        key={button.style}
                        active={button.style === blockType}
                        onToggle={props.onToggle}
                        style={button.style}
                        description={button.description}
                    />
                );
            })}
        </div>
    );
};