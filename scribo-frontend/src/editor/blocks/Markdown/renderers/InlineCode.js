import React from 'react'

let InlineCode = ({ inline, children, ...rest }) => (
  <code className="inline-code content" {...rest}>{children}</code>
)

export default InlineCode
