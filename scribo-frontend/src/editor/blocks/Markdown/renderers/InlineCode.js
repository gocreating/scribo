import React from 'react'

let InlineCode = ({ children, ...rest }) => (
  <code className="inline-code content" {...rest}>{children}</code>
)

export default InlineCode
