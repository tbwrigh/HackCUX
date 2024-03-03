import React from 'react';
import { Tweet } from 'react-tweet'

import '../App.css'

import { WobjectProps } from "./Wobject"

function TweetWobject(props: WobjectProps) {
    return <Tweet id={props.wobject.fields.find(field => field.type == "id")!.value} />
}

export default TweetWobject;