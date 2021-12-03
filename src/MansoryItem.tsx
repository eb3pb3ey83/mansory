import React from 'react';

interface Props {
  index: number;
  component: React.ReactNode;
}

const MansoryItemRef = React.forwardRef(({ index, component }: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
  return (
    <div key={index} className={`masonry-item masonry-item-width masonry-item${index}`} ref={ref}>
      {component}
    </div>
  );
});

export const MansoryItem = React.memo(MansoryItemRef);
