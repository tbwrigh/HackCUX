import React, { useState } from 'react';

interface ChatWindowProps {
    WhiteboardIndex: number;
}

interface Message {
    text: string;
    sender: 'user' | 'server';
}

interface ChatReqBody {
    text: string;
    message_history: string[];    
}

function ChatWindow({WhiteboardIndex}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [serverThinking, setServerThinking] = useState(false);
  
  const fetchResponse = async (userMessage: string) => {

    const req_body: ChatReqBody = {
        text: userMessage,
        message_history: []
    };

    if (messages.length > 0) {
        req_body.message_history = messages.map((message) => message.text);
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/${WhiteboardIndex}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(req_body)
    });
    const data = await response.json();
    return data["response"];
  };

  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = input;
    setMessages(messages => [...messages, { text: userMessage, sender: 'user' }]);
    setInput(''); // Clear input field

    setMessages(messages => [...messages, { text: '...', sender: 'server' }]);
    setServerThinking(true);
    const response = await fetchResponse(userMessage);
    setMessages(messages => [...(messages.slice(0, -1)), { text: response, sender: 'server' }]);
    setServerThinking(false);
  };

  return (
    <div id={`chat-window-${WhiteboardIndex}`} className="fixed bottom-0 right-0 mb-4 mr-4 max-w-xs p-4 bg-white rounded-lg shadow-lg">
        <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="block m-2 text-gray-800 self-end flex flex-row"
        >
            <span className="underline mr-2">Chat</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${isCollapsed ? '' : 'rotate-180'} transition duration-500 w-6 h-6`}>
              <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
            </svg>
        </button>
        <div className={`${isCollapsed ? 'hidden' : ''} transition-all duration-500 flex flex-col`}>
            <div className="h-64 overflow-y-auto">
                {messages.map((message, index) => (
                      <div key={index} className={`text-left m-2 p-2 rounded-lg ${message.sender === 'user' ? 'text-right bg-blue-600 text-white m-l-max' : 'bg-gray-200'} ${message.sender === 'server' && message.text === '...' ? 'animate-pulse' : ''}`}>
                      {message.text}
                      </div>
                ))}
            </div>
            <input
                className="mt-2 mb-2 shadow appearance-none border rounded-full w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // leave edit mode on pressing escape
                  // (makes vim users happy)
                  if (e.key == 'Enter') {
                    sendMessage();
                  }
                }}
                disabled={serverThinking}
            />
            <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
            >
                Send
            </button>
        </div>
    </div>
  );
}

export default ChatWindow;
