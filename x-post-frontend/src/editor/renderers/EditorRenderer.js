import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'
import ParagraphEditor from '../blocks/Paragraph/ParagraphEditor'
import HeaderEditor from '../blocks/Header/HeaderEditor'
import CodeHighlightEditor from '../blocks/CodeHighlight/CodeHighlightEditor'
import MarkdownEditor from '../blocks/Markdown/MarkdownEditor'
import ImageEditor from '../blocks/Image/ImageEditor'
import QuoteEditor from '../blocks/Quote/QuoteEditor'
import UnknownEditor from '../blocks/Unknown/UnknownEditor'
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
