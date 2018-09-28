import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PlainTextEditor from './blocks/PlainText/PlainTextEditor'
import BlockTypes from '../constants/BlockTypes'

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((block, idx) => {
      if (block.type === BlockTypes.PLAIN_TEXT) {
        return (
          <PlainTextEditor
            key={block.id}
            block={block}
            // react-sortable-hoc props
            index={idx}
            // xBlock hoc props
            idx={idx}
          />
        )
      }
      return null;
    })}
  </div>
)

export default SortableContainer(BlockList)
