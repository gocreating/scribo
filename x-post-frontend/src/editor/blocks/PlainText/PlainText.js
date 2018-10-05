import React from 'react'
import './PlainText.css'

let PlainText = ({ block }) => (
  <p className="plaintext content web-font">
    {
      block.values.text
        .split('\n')
        .map((line, idx) => (
          <span key={`${idx}-${line}`}>
            {line}
            <br/>
          </span>)
        )
    }
  </p>
)

export default PlainText
