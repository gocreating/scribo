import React, { Component } from 'react'
import PlainText from '../../PlainText/PlainText'

class Paragraph extends Component {
  render() {
    let { children } = this.props
    let block = {
      values: {},
    }

    return (
      <PlainText block={block}>
        {children}
      </PlainText>
    )
  }
}

export default Paragraph
