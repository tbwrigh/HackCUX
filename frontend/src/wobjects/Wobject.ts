import React from 'react';

import CodeWobject from './Code'
import TextWobject from './Text'

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
    class: TextWobject,
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

export interface WobjectProps {}