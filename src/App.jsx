import React from 'react';
import { Value } from 'slate';
import { Editor } from './editor';

import './App.css';

import { plugin as annotatePlugin, AnnotateToolbar } from './plugins/annotations';
import { plugin as markShortcutsPlugin } from './plugins/mark-shortcuts';
import { Toolbar, plugin as toolbarPlugin } from './plugins/toolbar';
import HistoryButtons from './plugins/history';
import tablePlugin, { TableToolbar } from './plugins/table';
import listPlugin, { ListToolBar } from './plugins/list';
import alignmentPlugin, { AlignmentToolBar } from './plugins/alignment';

const plugins = [
    markShortcutsPlugin(),
    toolbarPlugin(),
    annotatePlugin(),
    listPlugin(),
    alignmentPlugin(),
    ...tablePlugin,
];

const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(
    existingValue || {
        document: {
            nodes: [
                {
                    object: 'block',
                    type: 'paragraph',
                    nodes: [
                        {
                            object: 'text',
                            leaves: [
                                {
                                    text: 'A line of text in a paragraph',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: initialValue,
        };
    }

    onChange = ({ value }) => {
        const { value: stateValue } = this.state;
        if (value.document !== stateValue.document) {
            const content = JSON.stringify(value.toJSON());
            console.log(content);
            localStorage.setItem('content', content);
        }
        this.setState({
            value,
        });
    };

    render() {
        const { value } = this.state;
        return (
            <div className="app">
                <div className="pos-fixed">
                    <p className="app-headline">SlateJS Editor</p>
                    <Toolbar
                        onChange={this.onChange}
                        value={value}
                        render={({ DefaultButtons }) => (
                            <React.Fragment>
                                <DefaultButtons />
                                <HistoryButtons value={value} onChange={this.onChange} />
                                <TableToolbar value={value} onChange={this.onChange} />
                                <AnnotateToolbar value={value} onChange={this.onChange} />
                                <ListToolBar value={value} onChange={this.onChange} />
                                <AlignmentToolBar value={value} onChange={this.onChange} />
                            </React.Fragment>
                        )}
                    />
                </div>
                <div className="container">
                    <div className="editor">
                        <Editor value={value} onChange={this.onChange} plugins={plugins} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
