import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { Style } from './Style';
import './style.css';
import { useMansoryFilter } from './useMansoryFilter';
import { useMansoryStyle } from './useMansoryStyle';

export interface Props {
  column: number;
  padding: string;
  children: React.ReactNode[];
  childrenRef: React.MutableRefObject<HTMLDivElement[]>
}

export interface Params {
  childrenRef: React.MutableRefObject<HTMLDivElement[]>
  column: number
}

export interface Position {
  left: number
  top: number;
  bottom: number;
  index: number
}

export const Masonry = ({ children, childrenRef, column }: Props) => {
  const { itemWidth, elements, newStyle, itemStyles, onScroll } = useMansoryFilter({ children, childrenRef, column })

  return (
    (
      <div
        onScroll={onScroll}
        className="masonry-list-container"
        style={{ height: window.innerHeight }}
      >
        <div className="masonry-list" style={newStyle}>
          <Style>{itemWidth}</Style>
          <Style>{itemStyles}</Style>
          {elements}
        </div>
      </div>
    )
  );
};
