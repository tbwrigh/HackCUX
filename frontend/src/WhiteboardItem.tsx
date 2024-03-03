import React from 'react';

interface WhiteboardItemProps {
  id: number,
  label: string;
  setSelectedWhiteboardID: (arg0: number) => void;
}

function WhiteboardItem({ id, label, setSelectedWhiteboardID }: WhiteboardItemProps) {

  const onClick = () => {
    setSelectedWhiteboardID(id);
  }

  return (
    <li onClick={onClick} className="py-2">{label}</li>
  );
}

export default WhiteboardItem;