import React from 'react';
import monaco from 'monaco-editor';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import '../App.css'

import { WobjectProps } from "./Wobject"

function CodeWobject(props: WobjectProps) {
    const editor = React.createRef();

    return (
        <Editor
            onChange={(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => {
                props.wobject.customData = value!;
            }}
            value={props.wobject.customData}
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