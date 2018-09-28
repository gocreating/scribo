import React from 'react'
import './PlainText.css'

let PlainText = ({ values }) => (
  <p className="plaintext content web-font">
    {
      values
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
