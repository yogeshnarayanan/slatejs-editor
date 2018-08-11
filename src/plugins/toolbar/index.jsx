import React, { Fragment } from 'react';

const DEFAULT_NODE = 'paragraph';

const DefaultToolbarWrapper = ({ children }) => <div className="toolbar">{children}</div>;

const DefaultButton = ({ onMouseDown, labelShort }) => (
    <button onMouseDown={onMouseDown}>{labelShort}</button>
);

export class Toolbar extends React.PureComponent {
    onClickMark = (event, type) => {
        event.preventDefault();
        const { value } = this.props;
        const change = value.change().toggleMark(type);
        this.props.onChange(change);
    };

    onClickBlock = (event, type) => {
        event.preventDefault();
        const { value } = this.props;
        const change = value.change();

        const isActive = this.hasBlock(type);
        const isList = this.hasBlock('list-item');

        if (isList) {
            change
                .setBlock(isActive ? DEFAULT_NODE : type)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list');
        } else {
            change.setBlock(isActive ? DEFAULT_NODE : type);
        }

        this.props.onChange(change);
    };

    onClickListBlock = (event, type) => {
        event.preventDefault();
        const { value } = this.props;
        const change = value.change();
        const { document } = value;

        const isList = this.hasBlock('list-item');
        const isType = value.blocks.some(
            block => !!document.getClosest(block.key, parent => parent.type === type),
        );

        if (isList && isType) {
            change
                .setBlock(DEFAULT_NODE)
                .unwrapBlock('bulleted-list')
                .unwrapBlock('numbered-list');
        } else if (isList) {
            change
                .unwrapBlock(type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
                .wrapBlock(type);
        } else {
            change.setBlock('list-item').wrapBlock(type);
        }
        this.props.onChange(change);
    };

    hasBlock = (type) => {
        const { value } = this.props;
        return value.blocks.some(node => node.type === type);
    };

    render() {
        const ToolbarWrapper = this.props.toolbarWrapper || DefaultToolbarWrapper;
        const Button = this.props.button || DefaultButton;
        const DefaultButtons = () => (
            <Fragment>
                <Button
                    type="mark"
                    label="Bold"
                    labelShort="B"
                    onMouseDown={e => this.onClickMark(e, 'bold')}
                />
                <Button
                    type="mark"
                    label="Italic"
                    labelShort="I"
                    onMouseDown={e => this.onClickMark(e, 'italic')}
                />
                <Button
                    type="mark"
                    label="underline"
                    labelShort="U"
                    onMouseDown={e => this.onClickMark(e, 'underline')}
                />
                <Button
                    type="mark"
                    label="code"
                    labelShort="<>"
                    onMouseDown={e => this.onClickMark(e, 'code')}
                />
                <Button
                    type="node"
                    label="H1"
                    labelShort="H1"
                    onMouseDown={e => this.onClickBlock(e, 'heading-one')}
                />
                <Button
                    type="node"
                    label="H2"
                    labelShort="H2"
                    onMouseDown={e => this.onClickBlock(e, 'heading-two')}
                />
            </Fragment>
        );

        return (
            <ToolbarWrapper>
                {this.props.render ? (
                    this.props.render({
                        DefaultButtons,
                        onClickMark: this.onClickMark,
                    })
                ) : (
                    <DefaultButtons />
                )}
            </ToolbarWrapper>
        );
    }
}

const defaultNodeRenderer = {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
};

export const plugin = () => ({
    renderNode: defaultNodeRenderer,
});
