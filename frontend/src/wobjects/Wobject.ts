import React from 'react';

import CodeWobject from './Code'
import ImageWobject from './Image'
import TextWobject from './Text'
import TweetWobject from './Tweet'
import VideoWobject from './Video'
import WebsiteWobject from './Website'

export interface CreateWobjectProps {
  x: number;
  y: number;
  setCreatedWobject: React.Dispatch<React.SetStateAction<CreatedWobject|null>>;
}

export interface CreatedWobject {
  type: string;
  x: number;
  y: number;
  networkId: number|null;
  fields: {type: string, value: string}[];
  customData: string;
}

export const WobjectTypes = [
  {
    label: 'Text',
    type: 'text',
    icon: 'comment',
    fields: [],
    preserveAspectRatio: false,
    class: TextWobject,
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
    preserveAspectRatio: false,
    class: CodeWobject,
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
    preserveAspectRatio: true,
    class: VideoWobject,
  },
  {
    label: 'Image',
    type: 'image',
    icon: 'image',
    fields: [{
      label: 'Image URL',
      type: 'url',
      hint: 'https://tgrcode.com/logo.png',
    }],
    preserveAspectRatio: true,
    class: ImageWobject,
  },
  {
    label: 'Tweet',
    type: 'tweet',
    icon: 'textsms',
    fields: [{
      label: 'Tweet ID',
      type: 'id',
      hint: '1763419200930947198',
    }],
    preserveAspectRatio: true,
    class: TweetWobject,
  },
  {
    label: 'Website',
    type: 'tweet',
    icon: 'public',
    fields: [{
      label: 'URL',
      type: 'url',
      hint: 'https://tgrcode.com/',
    }],
    preserveAspectRatio: false,
    class: WebsiteWobject,
  },
];

export interface WobjectProps {
  wobject: CreatedWobject,
}

export interface Wobject {
  type: string;

  x: number;
  y: number;
  xMouseStart: number;
  yMouseStart: number;
  xStart: number;
  yStart: number;
  currentlyDragging: boolean;

  xMouseStartExtending: number;
  yMouseStartExtending: number;
  xStartExtending: number;
  yStartExtending: number;
  currentlyExtending: boolean;

  selected: boolean;
  id: number;
  currentWidth: number;
  currentHeight: number;
  ref: React.RefObject<HTMLDivElement>;
  extendingRef: React.RefObject<HTMLDivElement>;
  wobjectElement: React.ReactNode;
  z: number;

  wobject: CreatedWobject;
}