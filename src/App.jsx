import React from 'react';
import { Value } from 'slate';
import { Editor } from './editor';

import { plugin as markShortcutsPlugin } from './plugins/mark-shortcuts';
import { Toolbar, plugin as toolbarPlugin } from './plugins/toolbar';
import HistoryButtons from './plugins/history';

const plugins = [markShortcutsPlugin(), toolbarPlugin()];

const existingValue = JSON.parse(localStorage.getItem('content'));
const initialValue = Value.fromJSON(existingValue || {
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
});

class App extends React.Component {
    state = {
        value: initialValue,
    };

  onChange = ({ value }) => {
    const { value: stateValue } = this.state;
    if (value.document !== stateValue.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem('content', content);
    }
    this.setState({
      value,
    });
  };

    render() {
        const { value } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to SlateJS full Editor</h1>
                </header>
                <p className="App-intro">SlateJS Editor</p>
                <Toolbar
                    onChange={this.onChange}
                    value={value}
                    render={({ DefaultButtons }) => (
                      <React.Fragment>
                            <DefaultButtons />
                            <HistoryButtons value={this.state.value} onChange={this.onChange} />
                        </React.Fragment>
                    )}
                />
                <HistoryButtons value={value} onChange={this.onChange} />
                <Editor value={value} onChange={this.onChange} plugins={plugins} />
            </div>
        );
    }
}

export default App;
