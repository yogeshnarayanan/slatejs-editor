import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Table extends Component {
    static childContextTypes = {
        isInTable: PropTypes.bool,
    };

    getChildContext() {
        return { isInTable: true };
    }

    render() {
        const { attributes, children } = this.props;
        return (
            <table>
                <tbody {...attributes}>{children}</tbody>
            </table>
        );
    }
}

export default Table;
