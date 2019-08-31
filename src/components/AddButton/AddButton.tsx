import * as React from 'react';
import {DraftBlockType, EditorState, SelectionState} from 'draft-js';

import {getSelectedBlockNode} from '../../util/selection';
import {SideButton} from '../../MediumDraftEditor';
import './AddButton.css';

interface AddButtonProps {
    editorState: EditorState;
    sideButtons: SideButton[];
    getEditorState: () => EditorState;
    setEditorState: (state: EditorState) => void;
    focus: () => void;
}

interface AddButtonState {
    visible: boolean;
    isOpen: boolean;
    top: number;
    blockType: DraftBlockType;
    blockKey: string;
}

/**
 * Implementation of the medium-link side `+` button to insert various rich blocks
 * like Images/Embeds/Videos.
 */
export class AddButton extends React.PureComponent<AddButtonProps, AddButtonState> {

    public state: Readonly<AddButtonState> = {
        visible: false,
        isOpen: false,
        blockType: 'unstyled',
        blockKey: '',
        top: 0,
    };

    private node: HTMLElement = null;

    public componentDidMount() {
        document.addEventListener('mousedown', this.fastBlockFind);
    }

    public componentWillUnmount(): void {
        document.removeEventListener('mousedown', this.fastBlockFind);
    }

    // To show + button only when text length == 0
    public static getDerivedStateFromProps(newProps: AddButtonProps) {
        const {editorState} = newProps;
        const selectionState = editorState.getSelection();
        const anchorKey = selectionState.getAnchorKey();

        if (selectionState.isCollapsed() && anchorKey === selectionState.getFocusKey()) {
            const contentState = editorState.getCurrentContent();
            const block = contentState.getBlockForKey(anchorKey);

            if (block && block.getType().indexOf('atomic') !== 0 && block.getLength() === 0) {
                return {
                    visible: true,
                    blockType: block.getType(),
                    blockKey: block.getKey(),
                };
            }
        }

        return {
            visible: false,
            isOpen: false,
            blockType: 'unstyled',
            blockKey: '',
        };
    }

    public componentDidUpdate(prevProps: Readonly<AddButtonProps>, prevState: Readonly<AddButtonState>): void {
        if (this.state.visible) {
            if (prevState.blockKey !== this.state.blockKey || this.state.blockType !== prevState.blockType) {
                this.findNode();
            }
        }
    }

    public render() {
        if (!this.state.visible) {
            return null;
        }

        return (
            <div className="md-side-toolbar" style={{top: this.state.top + 'px'}}>
                <button
                    onClick={this.toggleToolbar}
                    className={`md-sb-button md-add-button${this.state.isOpen ? ' md-add-button--open' : ''}`}
                    type="button"
                >
                    <svg viewBox="0 0 14 14" height="14" width="14">
                        <polygon points="14,5 9,5 9,0 5,0 5,5 0,5 0,9 5,9 5,14 9,14 9,9 14,9 "/>
                    </svg>
                </button>
                {
                    this.state.isOpen ? (
                        <div className="mb-side-menu">
                            {
                                this.props.sideButtons.map((button, index) => {
                                    const Button = button.component;
                                    const extraProps = button.props ? button.props : {};

                                    return (
                                        <Button
                                            {...extraProps}
                                            key={index}
                                            getEditorState={this.props.getEditorState}
                                            setEditorState={this.props.setEditorState}
                                            close={this.toggleToolbar}
                                        />
                                    );
                                })
                            }
                        </div>
                    ) : null
                }
            </div>
        );
    }

    private findNode() {
        const node = getSelectedBlockNode(window);
        if (node !== this.node) {
            if (node) {
                this.node = node;

                this.setState({
                    visible: true,
                    top: node.offsetTop
                });
            } else {
                this.setState({
                    visible: false,
                    isOpen: false,
                });
            }
        }
    }

    private toggleToolbar = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        }, () => { // callback function
            // save page state
            const x = window.scrollX || window.pageXOffset;
            const y = window.scrollY || window.pageYOffset;
            // do focus
            this.props.focus();
            // back previous window state
            window.scrollTo(x, y);
        });
    }

    private fastBlockFind = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const attr = target.getAttribute('data-offset-key');

        if (attr) {

            const blockSearch = /^[a-z0-9]+/.exec(attr);

            if (blockSearch && blockSearch[0]) {
                const blockKey = blockSearch[0];
                const block = this.props.editorState.getCurrentContent().getBlockForKey(blockKey);

                if (block && block.getText().length === 0) {
                    const newSelection = new SelectionState({
                        anchorKey: blockKey,
                        anchorOffset: 0,
                        focusKey: blockKey,
                        focusOffset: 0
                    });

                    this.props.setEditorState(EditorState.forceSelection(this.props.getEditorState(), newSelection));
                }
            }
        }
    }
}
