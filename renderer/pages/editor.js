import React, { useEffect, useState } from 'react'
import { useGlobal, css } from 'trousers';
import { ipcRenderer } from 'electron';
import { Value } from 'slate';

import { Editor } from '../containers'

const globals = css`
    * {
        box-sizing: border-box;
    }

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

const EditorPage = () => {
  const clearGlobals = useGlobal(globals);
  const [state, setState] = useState({
    value: Value.fromJSON({
      'object': 'value',
      'document': {
        'object': 'document',
        'nodes': [{
          'object': 'block',
          'type': 'paragraph',
          'nodes': [{
            'object': 'text',
            'text': '',
          }],
        }],
      },
    })
  });

  useEffect(() => () => clearGlobals(), [])
  useEffect(() => {
    if (!ipcRenderer) return;

    ipcRenderer.on('file-opened', (event, message) =>
      setState({ value: message })
    );

    ipcRenderer.on('file-saved', (event, message) =>
      ipcRenderer.send('save-file', state.value)
    );
  }, [])

  return (
    <Editor
      value={state.value}
      onChange={value => setState({ value })}
    />
  );
};

export default EditorPage;
