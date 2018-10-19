import React, { Fragment } from 'react';
import classNames from 'classnames';

import { alignmentMarkStrategy, hasMark, getMark } from './AlignmentUtils';

import AlignmentKeyboardShortcut from './AlignmentKeyboardShortcut';

export const defaultRenderer = {
    alignment: (props) => {
        console.log(`props::${props}`);
        const {
            children,
            node: { data },
        } = props;
        return <div style={{ textAlign: `${data.get('align')}` }}>{children}</div>;
    },
};

export const AlignmentRightButton = ({
    value, onChange, changeState, className, style,
}) => (
    <button
        style={style}
        type="button"
        onClick={() => onChange(alignmentMarkStrategy(value.change(), 'right'))}
        className={classNames(
            { active: hasMark(value) && getMark(value).data.get('align') === 'right' },
            className,
        )}
    >
        {'right'}
    </button>
);

export const AlignmentLeftButton = ({
    value, onChange, changeState, className, style,
}) => (
    <button
        style={style}
        type="button"
        onClick={() => onChange(alignmentMarkStrategy(value.change(), 'left'))}
        className={classNames(
            { active: hasMark(value) && getMark(value).data.get('align') === 'left' },
            className,
        )}
    >
        {'left'}
    </button>
);

export const AlignmentCenterButton = ({
    value, onChange, changeState, className, style,
}) => (
    <button
        style={style}
        type="button"
        onClick={() => onChange(alignmentMarkStrategy(value.change(), 'center'))}
        className={classNames(
            { active: hasMark(value) && getMark(value).data.get('align') === 'center' },
            className,
        )}
    >
        {'center'}
    </button>
);

export const AlignmentToolBar = props => (
    <Fragment>
        <AlignmentLeftButton {...props} />
        <AlignmentCenterButton {...props} />
        <AlignmentRightButton {...props} />
    </Fragment>
);

const alignmentPlugin = options => ({
    onKeyDown(...args) {
        return AlignmentKeyboardShortcut(...args);
    },
});

const plugin = () => ({
    renderNode: defaultRenderer,
    name: 'node-alignment',
    plugin: alignmentPlugin,
});
export default plugin;
