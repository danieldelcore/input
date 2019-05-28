import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useGlobal, css } from 'trousers';
import { ipcRenderer } from 'electron';
import { Editor } from '../containers'

const globals = css`
    * {
        box-sizing: border-box;
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

  useEffect(() => () => clearGlobals(), [])
  useEffect(() => {
    if (!ipcRenderer) return;

    ipcRenderer.on('file-opened', (event, message) =>
      setState({ value: message })
    );
  })

  return (
    <Editor />
  )
};

export default EditorPage;
