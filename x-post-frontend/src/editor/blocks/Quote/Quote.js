import React from 'react'
import './Quote.scss'

let Quote = ({ block, children, ...rest }) => (
  <blockquote
    cite={block.values.cite}
    className="quote content web-font"
  >
    {block.values.text}
    {block.values.isShowCite && (
      <cite>{block.values.cite}</cite>
    )}
  </blockquote>
)

export default Quote
