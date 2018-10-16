import React from 'react'
import Textarea from 'react-autosize-textarea'

let TextAreaAutoSize = ({ input, ...rest }) => (
  <Textarea
    {...input}
    {...rest}
  />
)

export default TextAreaAutoSize
