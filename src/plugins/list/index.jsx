import React, { Fragment } from 'react';
import classNames from 'classnames';
import {
    unorderedListStrategy,
    isUnorderedList,
    orderedListStrategy,
    isOrderedList,
} from './ListUtils';
import ListKeyboardShortcut from './ListKeyboardShortcut';

export const defaultRenderer = {
    unorderedList: (props) => {
        const { attributes, children } = props;
        return <ul {...attributes}>{children}</ul>;
    },
    orderedList: (props) => {
        const { attributes, children } = props;
        return <ol {...attributes}>{children}</ol>;
    },
};

export const UnorderedListButton = ({
    value, onChange, className, style,
}) => (
    <button
        style={style}
        type="button"
        onClick={() => onChange(unorderedListStrategy(value.change()))}
        className={classNames({ active: isUnorderedList(value) }, className)}
    >
        {'li'}
    </button>
);

export const OrderedListButton = ({
    value, onChange, className, style,
}) => (
    <button
        style={style}
        type="button"
        onClick={() => onChange(orderedListStrategy(value.change()))}
        className={classNames({ active: isOrderedList(value) }, className)}
    >
        {'ol'}
    </button>
);

export const ListToolBar = props => (
    <Fragment>
        <UnorderedListButton {...props} />
        <OrderedListButton {...props} />
    </Fragment>
);

const listPlugin = options => ({
    onKeyDown(...args) {
        return ListKeyboardShortcut(...args);
    },
});

const plugin = () => ({
    renderNode: defaultRenderer,
    name: 'node-list',
    plugin: listPlugin,
});
export default plugin;
