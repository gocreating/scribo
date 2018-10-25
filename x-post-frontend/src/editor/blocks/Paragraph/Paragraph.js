import React from 'react'
import './Paragraph.css'
import pangu from 'pangu'

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
        {pangu.spacing(line)}
        <br/>
      </span>)
    )
  )
)

export default Paragraph
