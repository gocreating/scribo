import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import ParagraphEditor from '../blocks/Paragraph/ParagraphEditor'
import HeaderEditor from '../blocks/Header/HeaderEditor'
import CodeHighlightEditor from '../blocks/CodeHighlight/CodeHighlightEditor'
import MarkdownEditor from '../blocks/Markdown/MarkdownEditor'
import ImageEditor from '../blocks/Image/ImageEditor'
import QuoteEditor from '../blocks/Quote/QuoteEditor'
import UnknownEditor from '../blocks/Unknown/UnknownEditor'
import DropZonePlaceholder from '../utils/DropZonePlaceholder'
import BlockTypes from '../../constants/BlockTypes'

let renderMap = {
  [BlockTypes.PARAGRAPH]: ParagraphEditor,
  [BlockTypes.HEADER]: HeaderEditor,
  [BlockTypes.CODE_HIGHLIGHT]: CodeHighlightEditor,
  [BlockTypes.MARKDOWN]: MarkdownEditor,
  [BlockTypes.IMAGE]: ImageEditor,
  [BlockTypes.QUOTE]: QuoteEditor,
  [BlockTypes.UNKNOWN]: UnknownEditor,
}

let EditorRenderer = ({ blocks }) => (
  <Droppable droppableId="droppable-block-sort" ignoreContainerClipping>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        <DropZonePlaceholder attached="top" />
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
        {provided.placeholder}
        <DropZonePlaceholder attached="bottom" />
      </div>
    )}
  </Droppable>
)

export default EditorRenderer
