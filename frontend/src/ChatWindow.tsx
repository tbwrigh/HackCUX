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

    const response = await fetchResponse(userMessage);
    setMessages(messages => [...messages, { text: response, sender: 'server' }]);
  };

  return (
    <div id={`chat-window-${WhiteboardIndex}`} className="fixed bottom-0 right-0 mb-4 mr-4 max-w-xs p-4 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col">
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end"
            >
                {isCollapsed ? 'Show' : 'Hide'} Chat
            </button>
        </div>
        <div className={`${isCollapsed ? 'hidden' : ''} transition-all duration-500 flex flex-col`}>
            <div className="h-64 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`text-left ${message.sender === 'user' ? 'text-right' : ''}`}>
                    {message.text}
                    </div>
                ))}
            </div>
            <input
                className="mt-2 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Send
            </button>
        </div>
    </div>
  );
}

export default ChatWindow;