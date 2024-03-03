import React from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import '../App.css'

import { WobjectProps } from "./Wobject"

function CodeWobject(props: WobjectProps) {
    return (
        <Editor
            className="w-full h-full min-w-72 min-h-72"
            defaultLanguage={props.wobject.fields.find(field => field.type == "lang")?.value}
            defaultValue="// Type some JS code here... with intellisense!"
            options={{
                fontSize: 20,
            }}
        />
    );
}

export default CodeWobject;