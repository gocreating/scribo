import React from 'react'
import ReactMarkdown from 'react-markdown'
import breaks from 'remark-breaks'
import math from 'remark-math'
import Text from './renderers/Text'
// import Text from './renderers/Text'
import Paragraph from './renderers/Paragraph'
import Blockquote from './renderers/Blockquote'
import Image from './renderers/Image'
import Table from './renderers/Table'
import ListItem from './renderers/ListItem'
import Heading from './renderers/Heading'
import Code from './renderers/Code'
import InlineMath from './renderers/InlineMath'
import BlockMath from './renderers/BlockMath'
import './Markdown.css'

let defaultRenderers = {
  // disable applying pangu onto markdown paragraph
  // text: Text,
  paragraph: Paragraph,
  blockquote: Blockquote,
  image: Image,
  table: Table,
  tableHead: Table.Header,
  tableBody: Table.Body,
  tableRow: Table.Row,
  tableCell: Table.Cell,
  listItem: ListItem,
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
      breaks,
      math,
    ]}
  />
)

export default Markdown
