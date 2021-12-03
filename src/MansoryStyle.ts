import { Position } from './MasonryNew';
class MansoryStyle {
  constructor(
    private column: number,
    private childrenRef: React.RefObject<HTMLDivElement[]>,
    private itemStyles?: string | null
  ) {}

  // 每個物件的高度列表
  private getItemHeight() {
    if (!this.childrenRef.current) return []

    return this.childrenRef.current.filter((childNode) => childNode !== null)
    .map((childNode) => {
      return childNode.clientHeight
    })
  }
  public columnHeights = new Array(this.column).fill(0);

  public itemPositions: Position[] = [];

  private updateItemPositions() {
    this.getItemHeight().forEach((itemHeight, itemIndex) => {
      const translateY = Math.min(...this.columnHeights)
      // 最短的行索引
      const shortestColumnIndex = this.columnHeights.indexOf(translateY);

      this.itemPositions.push({
        index: itemIndex,
        left: shortestColumnIndex * 100,
        top: translateY,
        bottom: translateY + itemHeight
      });

      this.columnHeights[shortestColumnIndex] = this.columnHeights[shortestColumnIndex] + itemHeight;
    })
  }

  private getNewItemStyles() {
    const newItemStyles = []

    for (let i = 0; i < this.getItemHeight().length; i++) {
      const itemPosition = this.itemPositions[i]

      newItemStyles.push(`
        .masonry-item${i} {
          opacity: 1;
          transform: translate3d(${itemPosition.left}%, ${itemPosition.top}px, 0);
        }
      `)
    }

    return newItemStyles
  }

  public updateItemStyles() {
    if (this.getItemHeight().some(item => item === 0)) {
      return this.itemStyles
    }

    this.updateItemPositions()

    return this.getNewItemStyles()?.join('')
  }
}

export function createMansoryStyle(
  column: number,
  childrenRef: React.RefObject<HTMLDivElement[]>,
  itemStyles?: string | null
) {
  return new MansoryStyle(column, childrenRef, itemStyles);
}
