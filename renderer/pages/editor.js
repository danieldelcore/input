import React, { useEffect, useState } from 'react'
import { useGlobal, css } from 'trousers';

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

  useEffect(() => () => clearGlobals(), [])

  return (
    <Editor />
  );
};

export default EditorPage;
