import React, { useState } from 'react';

const AddWhiteboardPopup: React.FC<{ onClose: () => void, onSave: (name: string) => void }> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    onSave(name);
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Enter the name of the new whiteboard:</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default AddWhiteboardPopup;
