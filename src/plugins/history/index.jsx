import React, { Fragment } from 'react';

const DefaultHistoryButtons = ({ undo, redo }) => (
    <Fragment>
        <button type="button" onMouseDown={undo}>
            Undo
        </button>
        <button type="button" onMouseDown={redo}>
            Redo
        </button>
    </Fragment>
);

class HistoryButtons extends React.PureComponent {
    undo = (event) => {
        event.preventDefault();
        const { value, onChange } = this.props;
        const change = value.change().undo();
        onChange(change);
    };

    redo = (event) => {
        event.preventDefault();
        const { value, onChange } = this.props;
        const change = value.change().redo();
        onChange(change);
    };

    render() {
        const { render } = this.props;
        return render ? (
            render({
                undo: this.undo,
                redo: this.redo,
            })
        ) : (
            <DefaultHistoryButtons undo={this.undo} redo={this.redo} />
        );
    }
}

export default HistoryButtons;
