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
        if (this.props.plugins !== nextProps.plugins) {
            this.setState({
                ...this.mapToSlateProps(nextProps),
            });
        }
    };

    mapToSlateProps = (props) => {
        const plugins = props.plugins.reduce((plugins, plugin) => {
            if (!plugin.plugin) {
                return plugins;
            }
            if (Array.isArray(plugin.plugin)) {
                return [...plugins, ...plugin.plugin];
            }
            return [...plugins, plugin.plugin];
        }, []);

        const renderMark = props.plugins.reduce(
            (renderMark, plugin) => {
                if (!plugin.renderMark) return renderMark;
                return (props) => {
                    const result = renderMark(props);
                    if (result) return result;
                    return mergeMarkRenderers({
                        defaultRenderer: plugin.renderMark,
                        customRenderer: props.customRenderer,
                    })(props);
                };
            },
            i => null,
        );

        const renderNode = props.plugins.reduce(
            (renderNode, plugin) => {
                if (!plugin.renderNode) return renderNode;
                return (props) => {
                    const result = renderNode(props);
                    if (result) return result;
                    return mergeNodeRenderers({
                        defaultRenderer: plugin.renderNode,
                        customRenderer: props.customRenderer,
                    })(props);
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
        return (
            <SlateEditor
                value={this.props.value}
                onChange={this.props.onChange}
                plugins={this.state.plugins}
                renderMark={this.state.renderMark}
                renderNode={this.state.renderNode}
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
