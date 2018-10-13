import React from 'react'
import ReactMarkdown from 'react-markdown'
import Paragraph from './renderers/Paragraph'
import Table from './renderers/Table'
import Heading from './renderers/Heading'
import Code from './renderers/Code'
import './Markdown.css'

let defaultRenderers = {
  paragraph: Paragraph,
  table: Table,
  tableHead: Table.Header,
  tableBody: Table.Body,
  tableRow: Table.Row,
  tableCell: Table.Cell,
  heading: Heading,
  code: Code,
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
  />
)

export default Markdown
