import React from 'react';
import '../App.css';

import { WobjectProps } from "./Wobject";

function VideoWobject(props: WobjectProps) {
    const videoId = props.wobject.fields.find(field => field.type == "code")?.value;
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;

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
                src={videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded YouTube Video"
            />
        </div>
    );
}

export default VideoWobject;