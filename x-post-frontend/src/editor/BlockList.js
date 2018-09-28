import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PlainTextEditor from './blocks/PlainText/PlainTextEditor'
import UnknownEditor from './blocks/Unknown/UnknownEditor'
import BlockTypes from '../constants/BlockTypes'

let blockMap = {
  [BlockTypes.PLAIN_TEXT]: PlainTextEditor,
  [BlockTypes.UNKNOWN]: UnknownEditor,
}

let BlockList = ({ blocks }) => (
  <div>
    {blocks.map((block, idx) => {
      let Block = (
        blockMap[block.type] ||
        UnknownEditor
      )

      return (
        <Block
          key={block.id}
          block={block}
          // react-sortable-hoc props
          index={idx}
          // xBlock hoc props
          idx={idx}
          type={block.type}
        />
      )
    })}
  </div>
)

export default SortableContainer(BlockList)
