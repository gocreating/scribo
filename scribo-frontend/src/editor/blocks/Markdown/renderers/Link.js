import React from 'react'

let Link = ({ children, ...rest }) => (
  <a className="web-font" {...rest}>{children}</a>
)

export default Link
