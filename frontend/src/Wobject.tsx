import React from 'react';

// Define the props type
interface WobjectProps {
  children?: React.ReactNode;
}

const Wobject = React.forwardRef<HTMLDivElement, WobjectProps>((props, ref) => {
  return (
    <div className="border-none w-full h-full">
      <div className="w-full flex justify-between"
        style={{
          userSelect: 'none'
        }}
      >
        <span className="flex-1"></span>
        <i className="material-icons align-middle">fullscreen</i>
        <i className="material-icons align-middle">close</i>
      </div>
      {props.children}
    </div>
  )
});

export default Wobject
