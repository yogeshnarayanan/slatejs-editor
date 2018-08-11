import React from 'react';
import PropTypes from 'prop-types';

class Paragraph extends React.PureComponent {
    static contextTypes = {
        isInTable: PropTypes.bool,
    };

    render() {
        const { attributes, children } = this.props;
        const { isInTable } = this.context;

        const style = isInTable ? { margin: 0 } : {};

        return (
            <p style={style} {...attributes}>
                {children}
            </p>
        );
    }
}

export default Paragraph;
