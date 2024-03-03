import React from 'react';

import '../App.css'

import { WobjectProps } from "./Wobject"

function ImageWobject(props: WobjectProps) {
    return (
        <img src={props.wobject.fields.find(field => field.type == "url")?.value} className="min-w-64 min-h-64 w-full pointer-events-none" />
    );
}

export default ImageWobject;