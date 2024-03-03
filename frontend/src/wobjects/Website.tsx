import React from 'react';
import { Tweet } from 'react-tweet'

import '../App.css'

import { WobjectProps } from "./Wobject"

function WebsiteWobject(props: WobjectProps) {
    return (
        <div className="w-full h-full min-w-72" style={{
            position: 'relative',
            aspectRatio: '16 / 9',
        }}>
            <iframe
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
                className='w-full h-full'
                src={props.wobject.fields.find(field => field.type == "id")!.value}
            />
        </div>
    );
}

export default WebsiteWobject;