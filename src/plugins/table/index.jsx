import React, { Component } from 'react';
import PluginEditTable from 'slate-edit-table';
import alignPlugin from './aligns';
import {
    Paragraph, Table, TableCell, TableRow,
} from './components';

const tablePlugin = PluginEditTable({
    typeTable: 'table',
    typeRow: 'table_row',
    typeCell: 'table_cell',
    typeContent: 'paragraph',
});

const defaultNodeRenderer = {
    table: props => <Table {...props} />,
    table_row: props => <TableRow {...props} />,
    table_cell: props => <TableCell {...props} />,
    paragraph: props => <Paragraph {...props} />,
    heading: props => <h1 {...props.attributes}>{props.children}</h1>,
};

const plugins = [tablePlugin, alignPlugin, { renderNode: defaultNodeRenderer }];

export class TableToolbar extends Component {
    onInsertTable = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.insertTable);
    };

    onInsertColumn = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.insertColumn);
    };

    onInsertRow = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.insertRow);
    };

    onRemoveColumn = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.removeColumn);
    };

    onRemoveRow = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.removeRow);
    };

    onRemoveTable = (event) => {
        event.preventDefault();
        this.submitChange(tablePlugin.changes.removeTable);
    };

    onSetAlign = (event, align) => {
        event.preventDefault();
        this.submitChange(change => alignPlugin.changes.setColumnAlign(change, align));
    };

    submitChange(...args) {
        const { value, onChange } = this.props;
        const change = value.change().call(...args);
        onChange(change);
    }

    renderNormalToolbar() {
        return (
            <div className="toolbar">
                <button type="button" onClick={this.onInsertTable}>
                    Insert Table
                </button>
            </div>
        );
    }

    renderTableToolbar() {
        return (
            <div className="toolbar">
                <button type="button" onMouseDown={this.onInsertColumn}>
                    Insert Column
                </button>
                <button type="button" onMouseDown={this.onInsertRow}>
                    Insert Row
                </button>
                <button type="button" onMouseDown={this.onRemoveColumn}>
                    Remove Column
                </button>
                <button type="button" onMouseDown={this.onRemoveRow}>
                    Remove Row
                </button>
                <button type="button" onMouseDown={this.onRemoveTable}>
                    Remove Table
                </button>
                <button type="button" onMouseDown={e => this.onSetAlign(e, 'left')}>
                    Set align left
                </button>
                <button type="button" onMouseDown={e => this.onSetAlign(e, 'center')}>
                    Set align center
                </button>
                <button type="button" onMouseDown={e => this.onSetAlign(e, 'right')}>
                    Set align right
                </button>
            </div>
        );
    }

    render() {
        const { value } = this.props;
        const isInTable = tablePlugin.utils.isSelectionInTable(value);
        const isOutTable = tablePlugin.utils.isSelectionOutOfTable(value);

        return (
            <React.Fragment>
                {isInTable ? this.renderTableToolbar() : null}
                {this.renderNormalToolbar()}
            </React.Fragment>
        );
    }
}

export default plugins;
