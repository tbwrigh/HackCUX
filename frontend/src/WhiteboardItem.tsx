import React from 'react';

interface WhiteboardItemProps {
  id: number,
  label: string;
  setSelectedWhiteboardID: (arg0: number) => void;
}

function WhiteboardItem({ id, label, setSelectedWhiteboardID }: WhiteboardItemProps) {

  const onClick = () => {
    console.log('selected a different whiteboard');
    setSelectedWhiteboardID(id);
  }

  return (
    <li onClick={onClick} className="px-4 py-2 hover:bg-[#fcfdfe] cursor-pointer transition rounded-lg">{label}</li>
  );
}

export default WhiteboardItem;
