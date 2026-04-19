import clsx from 'clsx';
import { useMemo, useState } from 'react';

type Block = {
  x: number,
  y: number,
  value: string,
}

function App() {
  const [blocks, setBlocks] = useState(() => {
    const blocks: Block[] = []

    let cnt = 1;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        blocks.push({
          x: j,
          y: i,
          value: cnt.toString()
        })
        cnt++
      }
    }
    blocks[blocks.length-1].value = '';

    return blocks
  })

  return (
    <div className='h-dvh bg-black flex justify-center items-center'>
      <div className='w-80 h-80 border border-amber-400 relative'>
        {blocks.map((block) => (() => {
          const handleClick = useMemo(() => {
            if (block.value === '') return
            const newBlocks = [...blocks.map((b) => ({ ...b }))]
            const emptyBlock = newBlocks.find((b) => b.value === '')
  
            if (block.y === emptyBlock.y) {
              return () => {
                const minX = Math.min(block.x, emptyBlock.x)
                const maxX = Math.max(block.x, emptyBlock.x)
                const mov = block.x < emptyBlock.x ? 1 : -1
    
                let filteredBlocks = newBlocks.filter((b) => b.y === block.y)
                filteredBlocks = filteredBlocks.filter((b) => b.x >= minX && b.x <= maxX)
    
                filteredBlocks.forEach((b) => {
                  b.x += mov
                })
    
                emptyBlock.x = block.x
    
                setBlocks(newBlocks)
              }
            }
  
            if (block.x === emptyBlock.x) {
              return () => {
                const minY = Math.min(block.y, emptyBlock.y)
                const maxY = Math.max(block.y, emptyBlock.y)
                const mov = block.y < emptyBlock.y ? 1 : -1
                
                let filteredBlocks = newBlocks.filter((b) => b.x === block.x)
                filteredBlocks = filteredBlocks.filter((b) => b.y >= minY && b.y <= maxY)
                
                filteredBlocks.forEach((b) => {
                  b.y += mov
                })
    
                emptyBlock.y = block.y
    
                setBlocks(newBlocks)
              }
            }
          }, [blocks])

          const isDisabled = !handleClick;
          if (block.value === '') return null;

          return (
            <button
              key={block.value}
              type='button'
              className={clsx(
                'absolute w-20 h-20 text-white flex justify-center items-center text-4xl',
                'border border-amber-400',
                'transition-all',
                !isDisabled && 'hover:bg-gray-900',
              )}
              style={{
                left: 80 * block.x,
                top: 80 * block.y,
              }}
              onClick={handleClick}
              disabled={isDisabled}
            >
              {block.value}
            </button>
          )
        })())}
      </div>
    </div>
  )
}

export default App
