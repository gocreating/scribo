import React from 'react'
import './Paragraph.css'

let Paragraph = ({ block, children }) => (
  children ? (
    <span className="paragraph content web-font">
      {children}
    </span>
  ) : (
  block.values.text
    .split('\n')
    .map((line, idx) => (
      <span className="paragraph content web-font" key={`${idx}-${line}`}>
        {line}
        <br/>
      </span>)
    )
  )
)

export default Paragraph
