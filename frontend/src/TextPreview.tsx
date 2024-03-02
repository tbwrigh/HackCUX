import { useState } from 'react'
import Markdown from 'react-markdown'
import './App.css'

function TextPreview() {
  const [content, setContent] = useState('');
  // true means editing and false means previewing
  const [editing, setEditing] = useState(true);

  return (
    <div className="border rounded-2xl">
      { editing ?
      <textarea
        autoFocus
        value={content}
        onChange={e => setContent(e.target.value)}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        placeholder="Type Markdown here..."
        rows="10" cols="80"
        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      : null }
      { editing ? null :
      <article
        className="w-full rounded-2xl max-w-full prose p-8 transition duration-500 hover:bg-gray-100"
        onClick={() => setEditing(true)}
      >
        <Markdown>{content}</Markdown>
      </article>
      }
    </div>
  )
}

export default TextPreview
