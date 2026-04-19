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

  const emptyBlock = useMemo(() => blocks.find((b) => b.value === ''), [blocks]);

  const setCustomBlocks = () => {
    const customBlocks = [
      '10',  '3',  '7', '6',
       '2',  '1', '15', '9',
      '14', '12',  '',  '8',
      '13',  '5', '11', '4',
    ]

    const newBlocks = [...blocks.map((b) => ({ ...b }))];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const index = i * 4 + j;
        newBlocks[index].value = customBlocks[index];
        newBlocks[index].x = j;
        newBlocks[index].y = i;
      }
    }

    setBlocks(newBlocks);
  }

  return (
    <div className='h-dvh bg-black flex justify-center items-center'>
      <div className='w-80 h-80 border border-amber-400 relative'>
        {blocks.map((block) => (() => {
          const handleClick = useMemo(() => {
            if (block.value === '') return
            if (block.x !== emptyBlock.x && block.y !== emptyBlock.y) return

            return () => {
              const newBlocks = [...blocks.map((b) => ({ ...b }))]
              const newEmptyBlock = newBlocks.find((b) => b.value === '')
    
              if (block.y === newEmptyBlock.y) {
                const minX = Math.min(block.x, newEmptyBlock.x)
                const maxX = Math.max(block.x, newEmptyBlock.x)
                const mov = block.x < newEmptyBlock.x ? 1 : -1
    
                let filteredBlocks = newBlocks.filter((b) => b.y === block.y)
                filteredBlocks = filteredBlocks.filter((b) => b.x >= minX && b.x <= maxX)
    
                filteredBlocks.forEach((b) => {
                  b.x += mov
                })
    
                newEmptyBlock.x = block.x
              }
    
              if (block.x === newEmptyBlock.x) {
                const minY = Math.min(block.y, newEmptyBlock.y)
                const maxY = Math.max(block.y, newEmptyBlock.y)
                const mov = block.y < newEmptyBlock.y ? 1 : -1
                
                let filteredBlocks = newBlocks.filter((b) => b.x === block.x)
                filteredBlocks = filteredBlocks.filter((b) => b.y >= minY && b.y <= maxY)
                
                filteredBlocks.forEach((b) => {
                  b.y += mov
                })
    
                newEmptyBlock.y = block.y
              }

              setBlocks(newBlocks)
            }
          }, [blocks])

          const isDisabled = !handleClick;
          if (block.value === '') return null;

          return (
            <button
              key={block.value}
              type='button'
              className={clsx(
                'absolute w-20 h-20 text-white flex justify-center items-center text-4xl select-none',
                'border-2 border-amber-400',
                'transition-all',
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

      <button
        type='button'
        className='absolute bottom-2 right-2 select-none'
        onClick={setCustomBlocks}
      >
        <span className='text-2xl'>🎲</span>
      </button>
    </div>
  )
}

export default App
