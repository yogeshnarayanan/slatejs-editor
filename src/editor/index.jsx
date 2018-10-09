import React from 'react';
import { Editor as SlateEditor } from 'slate-react';

export class Editor extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.mapToSlateProps(props),
        };
    }

    componentWillReceiveProps = (nextProps) => {
        const { plugins } = this.props;
        if (plugins !== nextProps.plugins) {
            this.setState({
                ...this.mapToSlateProps(nextProps),
            });
        }
    };

    mapToSlateProps = (props) => {
        const plugins = props.plugins.reduce((plgns, plgn) => {
            if (!plgn.plugin) {
                return plgns;
            }
            if (Array.isArray(plgn.plugin)) {
                return [...plgns, ...plgn.plugin];
            }
            return [...plgns, plgn.plugin];
        }, []);

        const renderMark = props.plugins.reduce(
            (rndrMark, plugin) => {
                if (!plugin.renderMark) return rndrMark;
                return (prps) => {
                    const result = rndrMark(prps);
                    if (result) return result;
                    return mergeMarkRenderers({
                        defaultRenderer: plugin.renderMark,
                        customRenderer: props.customRenderer,
                    })(prps);
                };
            },
            i => null,
        );

        const renderNode = props.plugins.reduce(
            (rndrNode, plugin) => {
                if (!plugin.renderNode) return rndrNode;
                return (prps) => {
                    const result = rndrNode(prps);
                    if (result) return result;
                    return mergeNodeRenderers({
                        defaultRenderer: plugin.renderNode,
                        customRenderer: props.customRenderer,
                    })(prps);
                };
            },
            i => null,
        );

        return {
            plugins,
            renderMark,
            renderNode,
        };
    };

    render() {
        const { value, onChange } = this.props;
        const { plugins, renderMark, renderNode } = this.state;

        return (
            <SlateEditor
                value={value}
                onChange={onChange}
                plugins={plugins}
                renderMark={renderMark}
                renderNode={renderNode}
                ref={this.editor}
            />
        );
    }
}

const noop = () => null;

export function mergeMarkRenderers({ defaultRenderer, customRenderer }) {
    const renderer = { ...defaultRenderer, ...customRenderer };
    return (props) => {
        const fn = renderer[props.mark.type] || noop;
        return fn(props);
    };
}

export function mergeNodeRenderers({ defaultRenderer, customRenderer }) {
    const renderer = { ...defaultRenderer, ...customRenderer };
    return (props) => {
        const fn = renderer[props.node.type] || noop;
        return fn(props);
    };
}
