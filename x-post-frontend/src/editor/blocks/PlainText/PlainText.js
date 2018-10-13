import React from 'react'
import './PlainText.css'

let PlainText = ({ block, children }) => (
  <p className="plaintext content web-font">
    {children ? children : (
      block.values.text
        .split('\n')
        .map((line, idx) => (
          <span key={`${idx}-${line}`}>
            {line}
            <br/>
          </span>)
        )
    )}
  </p>
)

export default PlainText
