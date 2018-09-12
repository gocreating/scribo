import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PlainText from './blocks/PlainText'
import BlockTypes from '../constants/BlockTypes'

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((block, idx) => {
      let { id, type, preview, value } = block;

      if (type === BlockTypes.PLAIN_TEXT) {
        return (
          <PlainText
            key={id}
            index={idx}
            idx={idx}
            preview={preview}
            value={value}
          />
        )
      }
    })}
  </div>
)

export default SortableContainer(BlockList)
