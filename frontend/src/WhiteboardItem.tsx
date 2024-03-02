import React from 'react';

interface WhiteboardItemProps {
  label: string;
}

function WhiteboardItem({ label }: WhiteboardItemProps) {
  return (
    <li className="py-2">{label}</li>
  );
}

export default WhiteboardItem;