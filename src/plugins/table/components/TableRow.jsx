import React, { Component } from 'react';

const TableRow = ({ attributes, children }) => <tr {...attributes}>{children}</tr>;

export default TableRow;
