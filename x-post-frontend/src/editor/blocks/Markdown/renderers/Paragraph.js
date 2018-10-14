import React from 'react'
import PlainText from '../../PlainText/PlainText'

let Paragraph = (props) => {
  let { children } = props
  let block = {
    values: {},
  }

  return (
    <PlainText block={block}>
      {children}
    </PlainText>
  )
}

export default Paragraph
