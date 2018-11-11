import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import breaks from 'remark-breaks'
import math from 'remark-math'
import Han from 'han-css'
// import Text from './renderers/Text'
import Paragraph from './renderers/Paragraph'
import Blockquote from './renderers/Blockquote'
import Link from './renderers/Link'
import Image from './renderers/Image'
import Table from './renderers/Table'
import ListItem from './renderers/ListItem'
import Heading from './renderers/Heading'
import Code from './renderers/Code'
import InlineMath from './renderers/InlineMath'
import BlockMath from './renderers/BlockMath'
import 'han-css/dist/han.min.css'
import './Markdown.scss'

let defaultRenderers = {
  // disable applying pangu onto markdown paragraph
  // text: Text,
  paragraph: Paragraph,
  blockquote: Blockquote,
  link: Link,
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

class Markdown extends Component {
  markdownRef = React.createRef()

  componentDidMount() {
    Han(this.markdownRef.current).render()
  }

  render() {
    let { block, renderers } = this.props

    return (
      <div ref={this.markdownRef}>
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
      </div>
    )
  }
}

export default Markdown
