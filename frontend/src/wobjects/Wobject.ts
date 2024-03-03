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
  fields: {type: string, value: string}[]
}

export const WobjectTypes = [
  {
    label: 'Text',
    type: 'text',
    icon: 'comment',
    fields: [],
    class: TextWobject,
  },
  {
    label: 'Video',
    type: 'video',
    icon: 'ondemand_video',
    fields: [{
      label: 'Youtube Code',
      type: 'code',
      hint: 'o3885gOxEmc',
    }],
    class: VideoWobject,
  },
  {
    label: 'Code',
    type: 'code',
    icon: 'code',
    fields: [{
      label: 'Programming Language',
      type: 'lang',
      hint: 'json, html, css, typescript, javascript',
    }],
    class: CodeWobject,
  }
];

export interface WobjectProps {
  wobject: CreatedWobject,
}