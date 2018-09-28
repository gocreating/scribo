import React from 'react'
import { TextArea as SUITextArea } from 'semantic-ui-react'

let TextArea = ({ input, ...rest }) => (
  <SUITextArea
    {...input}
    {...rest}
  />
)

export default TextArea
