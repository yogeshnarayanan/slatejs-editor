import React from 'react';

export function CreateHotkey(options) {
    const { type, key } = options;

    // Return our "plugin" object, containing the `onKeyDown` handler.
    return {
        onKeyDown(event, change) {
            // Check that the key pressed matches our `key` option.
            if (!event.metaKey || event.key !== key) return;

            // Prevent the default characters from being inserted.
            event.preventDefault();

            // Toggle the mark `type`.
            change.toggleMark(type);
            return true;
        },
    };
}

export const hotkeysPlugin = [
    CreateHotkey({
        type: 'bold',
        key: 'b',
    }),
    CreateHotkey({
        type: 'code',
        key: 'd',
    }),
    CreateHotkey({
        type: 'italic',
        key: 'i',
    }),
    CreateHotkey({
        type: 'strikethrough',
        key: 's',
    }),
    CreateHotkey({
        type: 'underline',
        key: 'u',
    }),
];

const defaultRenderer = {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    strikethrough: props => <del>{props.children}</del>,
    underline: props => <u>{props.children}</u>,
};

export const hotkeysRenderer = defaultRenderer;

export const plugin = () => ({
    renderMark: hotkeysRenderer,
    plugin: hotkeysPlugin,
    name: 'mark-shortcuts',
});
