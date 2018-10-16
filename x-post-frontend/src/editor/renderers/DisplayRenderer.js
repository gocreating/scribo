import React from 'react'
import Paragraph from '../blocks/Paragraph/Paragraph'
import Header from '../blocks/Header/Header'
import CodeHighlight from '../blocks/CodeHighlight/CodeHighlight'
import Markdown from '../blocks/Markdown/Markdown'
import Image from '../blocks/Image/Image'
import Quote from '../blocks/Quote/Quote'
import Unknown from '../blocks/Unknown/Unknown'
import BlockTypes from '../../constants/BlockTypes'

let renderMap = {
  [BlockTypes.PARAGRAPH]: Paragraph,
  [BlockTypes.HEADER]: Header,
  [BlockTypes.CODE_HIGHLIGHT]: CodeHighlight,
  [BlockTypes.MARKDOWN]: Markdown,
  [BlockTypes.IMAGE]: Image,
  [BlockTypes.QUOTE]: Quote,
  [BlockTypes.UNKNOWN]: Unknown,
}

let DisplayRenderer = ({ blocks = [] }) => (
  blocks.map((block, idx) => {
    let Block = (
      renderMap[block.type] ||
      Unknown
    )

    return (
      <Block
        key={block.id}
        block={block}
      />
    )
  })
)

export default DisplayRenderer
