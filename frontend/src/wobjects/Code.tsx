import React from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import '../App.css'

import { WobjectProps } from "./Wobject"

function CodeWobject(props: WobjectProps) {
    return (
        <Editor className="w-full h-full min-w-72 min-h-72" defaultLanguage="javascript" defaultValue="// Type some JS code here... with intellisense!" />
    );
}

export default CodeWobject;