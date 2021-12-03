import React from 'react';
import { Params, Position } from './MasonryNew';
import { createMansoryStyle } from './MansoryStyle';

const arrayEquals = (a:number[], b:number[]) => {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

const getTopPosition = (positions: Position[]) => {
  return positions.map((position) => position.top)
}

const shouldUpdateList = (oldPosition: Position[], newPosition: Position[]) => {
  return newPosition.length !== 0 && !arrayEquals(getTopPosition(oldPosition), getTopPosition(newPosition))
}

export function useMansoryStyle({
  childrenRef,
  column,
}: Params) {
  const [itemWidth, setItemWidth] = React.useState<string | null | undefined>('');
  const [itemStyles, setItemStyles] = React.useState<string | null | undefined>('');
  const [itemPositions, setItemPositionss] = React.useState<Position[]>([]);
  const [tallestColumnHeight, setTallestColumnHeight] = React.useState(0);
  const resetItemPositions = React.useCallback(() => setItemPositionss([]), [])
  const resetItemStyles = React.useCallback(() => setItemStyles(''), [])

  const updateStyle = React.useCallback(
    () => {
      const mansoryModifier = createMansoryStyle(
        column,
        childrenRef,
        itemStyles
      );

      const newStyle = mansoryModifier.updateItemStyles();



      if (!shouldUpdateList(itemPositions, mansoryModifier.itemPositions)) return


      setItemStyles(newStyle);
      setItemPositionss(mansoryModifier.itemPositions);
      setTallestColumnHeight(Math.max(...mansoryModifier.columnHeights));
    },
    [column, childrenRef, itemPositions, itemStyles]
  );

  const newStyle = React.useMemo(
    () => ({
      height: tallestColumnHeight,
    }),
    [tallestColumnHeight]
  );

  return { itemWidth, setItemWidth, itemStyles, resetItemStyles, newStyle, childrenRef, itemPositions, resetItemPositions, updateStyle };
}
