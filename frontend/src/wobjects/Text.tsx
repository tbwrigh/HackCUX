import React from 'react';
import { useState } from 'react'
import Markdown from 'react-markdown'
import rehypeMathjax from 'rehype-mathjax'
import remarkMath from 'remark-math'

import '../App.css'

import { WobjectProps } from "./Wobject"

function TextWobject(props: WobjectProps) {
    const [content, setContent] = useState('');
    // true means editing and false means previewing
    const [editing, setEditing] = useState(true);

    return (
        <div>
            {editing ?
                <textarea
                    autoFocus
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onFocus={() => setEditing(true)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        // leave edit mode on pressing escape
                        // (makes vim users happy)
                        if (e.key == 'Escape') {
                            setEditing(false);
                        }
                    }}
                    placeholder="Type Markdown here..."
                    rows={20}
                    cols={80}
                    className="block w-full h-full p-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
                : null}
            {editing ? null :
                <article
                    className="w-full h-full prose p-8 transition duration-500 hover:bg-gray-100"
                    onClick={() => setEditing(true)}
                >
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>{content}</Markdown>
                </article>
            }
        </div>
    )
}

export default TextWobject;