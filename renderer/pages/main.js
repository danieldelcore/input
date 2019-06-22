import React, { useEffect, useState, useRef } from 'react';
import { theme, ThemeProvider } from '@zeropoly/geometric';
import { useGlobal, css } from 'trousers';
import { ipcRenderer } from 'electron';
import { Value } from 'slate';

import { Editor, editorSerializer } from '../components';

const globals = css`
    ::-webkit-scrollbar {
        display: none;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        position: absolute;
        margin: 0;
    }
`;

const MainPage = () => {
    const clearGlobals = useGlobal(globals);
    const editorRef = useRef(null);

    const [state, setState] = useState({
        value: Value.fromJSON({
            object: 'value',
            document: {
                object: 'document',
                nodes: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        nodes: [
                            {
                                object: 'text',
                                text: '',
                            },
                        ],
                    },
                ],
            },
        }),
    });

    useEffect(() => () => clearGlobals(), []);

    useEffect(() => {
        if (!ipcRenderer) return;

        ipcRenderer.on('file-opened', (event, message) => {
            setState({
                value: editorSerializer.deserialize(message),
            });
        });

        ipcRenderer.on('file-saved', event => {
            const value = editorSerializer.serialize(state.value);

            ipcRenderer.send('save-file', value);
        });

        ipcRenderer.on('format-mark', (event, message) =>
            editorRef.current.toggleMark(message),
        );

        return () => {
            ipcRenderer.removeAllListeners('file-opened');
            ipcRenderer.removeAllListeners('file-saved');
            ipcRenderer.removeAllListeners('format-mark');
        };
    }, [state.value]);

    return (
        <ThemeProvider theme={theme}>
            <Editor
                ref={editorRef}
                value={state.value}
                onChange={change => setState({ value: change.value })}
            />
        </ThemeProvider>
    );
};

export default MainPage;
