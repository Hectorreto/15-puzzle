import clsx from 'clsx';
import { useState } from 'react';

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

  const handleClick = (selectedBlock: Block) => {
    if (selectedBlock.value === '') return
    const newBlocks = [...blocks.map((block) => ({ ...block }))]
    const emptyBlock = newBlocks.find((block) => block.value === '')

    if (selectedBlock.y === emptyBlock.y) {
      const minX = Math.min(selectedBlock.x, emptyBlock.x)
      const maxX = Math.max(selectedBlock.x, emptyBlock.x)
      const mov = selectedBlock.x < emptyBlock.x ? 1 : -1
      
      let filteredBlocks = newBlocks.filter((block) => block.y === selectedBlock.y)
      filteredBlocks = filteredBlocks.filter((block) => block.x >= minX && block.x <= maxX)

      filteredBlocks.forEach((block) => {
        block.x += mov
      })

      emptyBlock.x = selectedBlock.x
    }

    if (selectedBlock.x === emptyBlock.x) {
      const minY = Math.min(selectedBlock.y, emptyBlock.y)
      const maxY = Math.max(selectedBlock.y, emptyBlock.y)
      const mov = selectedBlock.y < emptyBlock.y ? 1 : -1

      let filteredBlocks = newBlocks.filter((block) => block.x === selectedBlock.x)
      filteredBlocks = filteredBlocks.filter((block) => block.y >= minY && block.y <= maxY)

      filteredBlocks.forEach((block) => {
        block.y += mov
      })

      emptyBlock.y = selectedBlock.y
    }

    setBlocks(newBlocks)
  }

  return (
    <div className='h-dvh bg-black flex justify-center items-center'>
      <div className='w-80 h-80 border border-amber-400 relative'>
        {blocks.map((block) => (
          <button
            key={block.value}
            className={clsx(
              'absolute w-20 h-20 text-white flex justify-center items-center text-4xl',
              block.value !== '' && 'border border-amber-400 hover:bg-gray-900',
              'transition-all'
            )}
            type='button'
            style={{
              left: 80 * block.x,
              top: 80 * block.y,
            }}
            onClick={() => handleClick(block)}
          >
            {block.value}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
