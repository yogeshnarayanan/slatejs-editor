import React from 'react';

const TableCell = ({ attributes, children, node }) => {
    const textAlign = node.get('data').get('align', 'left');

    return (
        <td style={{ textAlign }} {...attributes}>
            {children}
        </td>
    );
};

export default TableCell;
