import React from 'react'
import ReactMarkdown from 'react-markdown'
import './Markdown.css'

let defaultRenderers = {
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
