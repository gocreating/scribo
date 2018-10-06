import React from 'react'
import './Header.css'

let Header = ({ block, ...rest }) => (
  React.createElement(
    `h${block.values.level}`,
    {
      ...rest,
      className: `header-level-${block.values.level} content web-font`,
    },
    block.values.text
  )
)

export default Header
