import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import './style.css';
import { useMansoryStyle } from './useMansoryStyle';



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

export interface Props {
  column: number;
  children: React.ReactNode[];
  childrenRef: React.MutableRefObject<HTMLDivElement[]>
}

export const useMansoryFilter = ({ children, childrenRef, column }: Props) => {
  const observer = React.useRef<ResizeObserver>()
  const [scrollTop, setScrollTop] = React.useState(() => 0);
  const { itemWidth, setItemWidth, newStyle, itemStyles, itemPositions, updateStyle } = useMansoryStyle({
    childrenRef,
    column,
  });

  const [imgLoadedLength, setImageLoadedLength] = React.useState(0)
  const [originalElements] = React.useState<React.ReactNode[]>(() => children)
  const [elements, setElements] = React.useState<React.ReactNode[]>(() => [])
  const [itemIndex, setItemIndex] = React.useState<number[]>(() => [])
  const currentPosition = window.innerHeight + scrollTop;
  const isAllImageLoaded = imgLoadedLength === children.length

  const onScroll = React.useCallback(
    (e: React.UIEvent<HTMLElement>) => setScrollTop(e.currentTarget.scrollTop),
    []
  );

  React.useEffect(() => {
    if (!isAllImageLoaded) return
    const newItemIndex = itemPositions.filter((item) => {
      return item.bottom >= scrollTop - 2500 && item.top <= currentPosition + 2500
    }).map((value) => value.index)

    const newItemsOnTheScreen = originalElements?.filter((_element, index) => {
      return newItemIndex.includes(index)
    })

    const findSubtractionLength = function(nums1: number[], nums2: number[]) {
      let targetList = nums1.length > nums2.length ? nums1 : nums2
      let filteredList = nums1.length > nums2.length ? nums2 : nums1
      return targetList.filter(current => !filteredList.includes(current)).length
    };

    const shouldUpdate = () => {
      return findSubtractionLength(itemIndex, newItemIndex) !== 0
    }

    if (!shouldUpdate()) return

    setItemIndex(newItemIndex)
    setElements(newItemsOnTheScreen)
  }, [isAllImageLoaded, originalElements, itemIndex, scrollTop, itemPositions, currentPosition, elements]);

  const loadImages = React.useCallback(() => {
    const imgs = document.querySelectorAll('img')

    observer.current =  new ResizeObserver((o) => {
      updateStyle();
    })

    imgs.forEach((img, index) => {

      img.onload = () => {
        observer.current && observer.current.observe(childrenRef.current[index])
        setImageLoadedLength(oldLength => oldLength + 1)
      }
    })
  }, [childrenRef, updateStyle])

  const setWidth = React.useCallback(() => {
    setItemWidth(`
      .masonry-item-width {
        width: ${100 / column}%;
      }
    `);
  }, [setItemWidth, column])

  React.useEffect(() => {
    window.addEventListener('load', () => {
      setWidth()
      setElements(originalElements)
      loadImages()
    })
  }, [column, setWidth, loadImages, childrenRef, originalElements]);

  return { itemWidth, elements, newStyle, itemStyles, onScroll }
}