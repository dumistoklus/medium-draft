import * as React from 'react';
import {EditorBlock, ContentBlock, EditorState} from 'draft-js';
import {updateDataOfBlock} from '../util/helpers';
import './code.scss';

interface Props {
    block: ContentBlock;
    blockProps: {
        getEditorState: () => EditorState;
        setEditorState: (es: EditorState) => void;
    };
}

export default class CodeBlock extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        const {block} = this.props;
        const lang = block.getData().get('language', '');

        return (
            <div className="md-block-code-wrapper" data-language={lang} spellCheck={false}>
                {/* <span contentEditable={false}>
          <button onClick={this.handleLanguage}>L</button>
        </span> */}
                <EditorBlock {...this.props} />
            </div>
        );
    }

    private handleLanguage = () => {
        const {block, blockProps} = this.props;
        const data = block.getData();
        const lang = prompt('Set Language:', data.get('language') || '');

        if (lang) {
            const {setEditorState, getEditorState} = blockProps;
            const newData = data.set('language', lang);
            setEditorState(updateDataOfBlock(getEditorState(), block, newData));
        }
    }
}
