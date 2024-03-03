import React from 'react';

import CodeWobject from './Code'

export interface CreateWobjectProps {
  x: number;
  y: number;
  setCreatedWobject: React.Dispatch<React.SetStateAction<CreatedWobject|null>>;
}

export interface CreatedWobject {
  type: string;
  x: number;
  y: number;
}

export const WobjectTypes = [
  {
    label: 'Text',
    type: 'text',
    class: CodeWobject,
  },
  {
    label: 'Video',
    type: 'video',
    class: CodeWobject,
  },
  {
    label: 'Code',
    type: 'code',
    class: CodeWobject,
  }
];

// Base class
export class BaseWobject<P extends {}> extends React.Component {
  constructor(props: Readonly<P>|P) {
    super(props);
  }
}