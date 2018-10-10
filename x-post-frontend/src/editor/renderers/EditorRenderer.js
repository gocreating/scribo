import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import PlainTextEditor from '../blocks/PlainText/PlainTextEditor'
import HeaderEditor from '../blocks/Header/HeaderEditor'
import CodeHighlightEditor from '../blocks/CodeHighlight/CodeHighlightEditor'
import UnknownEditor from '../blocks/Unknown/UnknownEditor'
import BlockTypes from '../../constants/BlockTypes'

let renderMap = {
  [BlockTypes.PLAIN_TEXT]: PlainTextEditor,
  [BlockTypes.HEADER]: HeaderEditor,
  [BlockTypes.CODE_HIGHLIGHT]: CodeHighlightEditor,
  [BlockTypes.UNKNOWN]: UnknownEditor,
}

let EditorRenderer = ({ blocks }) => (
  <div>
    {blocks.map((block, idx) => {
      let Block = (
        renderMap[block.type] ||
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

export default SortableContainer(EditorRenderer)
