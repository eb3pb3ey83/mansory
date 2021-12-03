import React from 'react';
import { render } from 'react-dom';
import { catNames, cats, randomChoice } from './cats';
import { MansoryItem } from './MansoryItem';
import { Masonry } from './MasonryNew';
import './style.css';


const App = () => {
  const [items] = React.useState(() =>
    Array.from(Array(1000), (_item, index) => ({
      id: index,
      name: randomChoice(catNames),
      src: randomChoice(cats)
    }))
  );

  const childrenRef = React.useRef<HTMLDivElement[]>([]);

  return (
    <div>
      <Masonry column={5} childrenRef={childrenRef} padding="10px">
        {items.map((item, index) => (
          <MansoryItem
            key={item.id}
            component={<div key={item.id} className="item">
              <img src={item.src} alt="" />
              <div className='title'>{item.name}</div>
            </div>}
            index={index}
            ref={(ref) => {
              if (ref === null) return
              childrenRef.current[index] = ref
            }}
          />
        ))}
      </Masonry>
    </div>
  );
};

render(<App />, document.getElementById('root'));
