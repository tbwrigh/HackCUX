import React from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import '../App.css'

import { WobjectProps } from "./Wobject"

function CodeWobject(props: WobjectProps) {
    return (
        <div>
            <Editor height="90vh" defaultLanguage="javascript" defaultValue="// some comment" />;
        </div>
    );
}

export default CodeWobject;