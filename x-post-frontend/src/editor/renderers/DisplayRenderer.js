import React from 'react'
import PlainText from '../blocks/PlainText/PlainText'
import Header from '../blocks/Header/Header'
import CodeHighlight from '../blocks/CodeHighlight/CodeHighlight'
import Markdown from '../blocks/Markdown/Markdown'
import Unknown from '../blocks/Unknown/Unknown'
import BlockTypes from '../../constants/BlockTypes'

let renderMap = {
  [BlockTypes.PLAIN_TEXT]: PlainText,
  [BlockTypes.HEADER]: Header,
  [BlockTypes.CODE_HIGHLIGHT]: CodeHighlight,
  [BlockTypes.MARKDOWN]: Markdown,
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
