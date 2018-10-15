import React from 'react'
import ReactMarkdown from 'react-markdown'
import math from 'remark-math'
import Paragraph from './renderers/Paragraph'
import Image from './renderers/Image'
import Table from './renderers/Table'
import Heading from './renderers/Heading'
import Code from './renderers/Code'
import InlineMath from './renderers/InlineMath'
import BlockMath from './renderers/BlockMath'
import './Markdown.css'

let defaultRenderers = {
  paragraph: Paragraph,
  image: Image,
  table: Table,
  tableHead: Table.Header,
  tableBody: Table.Body,
  tableRow: Table.Row,
  tableCell: Table.Cell,
  heading: Heading,
  code: Code,
  // remark plugin
  inlineMath: InlineMath,
  math: BlockMath,
}

let Markdown = ({ block, renderers }) => (
  <ReactMarkdown
    className="markdown content web-font"
    source={block.values.text}
    disallowedTypes={[
      'thematicBreak',
    ]}
    unwrapDisallowed
    renderers={{
      ...defaultRenderers,
      ...renderers,
    }}
    plugins={[
      math,
    ]}
  />
)

export default Markdown
