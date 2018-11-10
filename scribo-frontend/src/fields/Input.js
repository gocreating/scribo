import React from 'react'
import { Input as SUIInput } from 'semantic-ui-react'

let Input = ({ input, ...rest }) => (
  <SUIInput
    {...input}
    {...rest}
  />
)

export default Input
