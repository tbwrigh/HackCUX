import React from 'react';

import CodeWobject from './Code'
import TextWobject from './Text'
import VideoWobject from './Video'

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
    icon: 'comment',
    class: TextWobject,
  },
  {
    label: 'Video',
    type: 'video',
    icon: 'ondemand_video',
    class: VideoWobject,
  },
  {
    label: 'Code',
    type: 'code',
    icon: 'code',
    class: CodeWobject,
  }
];

export interface WobjectProps {}