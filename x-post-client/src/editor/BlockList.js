import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import Block from './Block'

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((value, index) => (
      <Block
        key={`item-${index}`}
        index={index}
        value={value}
      />
    ))}
  </div>
)

export default SortableContainer(BlockList)
