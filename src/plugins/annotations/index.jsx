import React, { Component } from 'react';
import { PortalWithState } from 'react-portal';

const addAnnotateMark = (change, annotation) => {
    change.addMark({
        type: 'annotate',
        data: {
            annotation,
        },
    });
};

const defaultRenderer = {
    annotate: (props) => {
        const { attributes, children, mark } = props;
        const annotation = mark.data.get('annotation');
        return (
            <strong
                {...attributes}
                data-annotation={annotation}
                style={{ backgroundColor: '#00ff00' }}
            >
                {children}
            </strong>
        );
    },
};

const annotateRenderer = defaultRenderer;

export class AnnotateToolbar extends Component {
    submitChange = (...args) => {
        const { value, onChange } = this.props;
        const change = value.change().call(...args);
        onChange(change);
    };

    handleSubmit = (e, closePortal) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const annotation = data.get('annotateText');
        if (annotation) {
            this.submitChange(addAnnotateMark, annotation);
            closePortal();
        }
    };

    render() {
        return (
            <PortalWithState closeOnOutsideClick closeOnEsc>
                {({
                    openPortal, closePortal, isOpen, portal,
                }) => (
                    <React.Fragment>
                        <div className="toolbar">
                            <button type="button" onClick={openPortal}>
                                Annotate
                            </button>
                        </div>
                        {portal(
                            <div className="modal">
                                <div className="modal-content">
                                    <span className="close">
                                        <button type="button" onClick={closePortal}>
                                            Close me!
                                        </button>
                                    </span>
                                    <form onSubmit={e => this.handleSubmit(e, closePortal)}>
                                        <p>
                                            <textarea id="annotateText" name="annotateText" />
                                            <button type="submit">Annotate</button>
                                        </p>
                                    </form>
                                </div>
                            </div>,
                        )}
                    </React.Fragment>
                )}
            </PortalWithState>
        );
    }
}

export const plugin = () => ({
    renderMark: annotateRenderer,
    name: 'mark-annotate',
    changes: {
        addAnnotateMark,
    },
});
