import React from 'react'
import './PlainText.css'

let PlainText = ({ value }) => (
  <p className="plaintext content web-font">
    {
      value
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
