import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import Block from './Block'

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((value, index) => (
      <Block
        key={`block-${index}`}
        index={index}
        idx={index}
        value={value}
      />
    ))}
  </div>
)

export default SortableContainer(BlockList)
