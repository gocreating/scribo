import React, { Component } from 'react'
import Header from '../../Header/Header'

class Heading extends Component {
  render() {
    let { level, children } = this.props
    let block = {
      values: {
        level,
      },
    }

    return (
      <Header block={block}>
        {children}
      </Header>
    )
  }
}

export default Heading
