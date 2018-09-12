import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PlainText from './blocks/PlainText'
import BlockTypes from '../constants/BlockTypes'

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((block, index) => {
      let { type, value } = block;

      if (type === BlockTypes.PLAIN_TEXT) {
        return (
          <PlainText
            key={`block-${index}`}
            index={index}
            idx={index}
            value={value}
          />
        )
      }
    })}
  </div>
)

export default SortableContainer(BlockList)
