import React, { Component } from 'react'
import CodeHighlight from '../../CodeHighlight/CodeHighlight'
import Themes from '../../CodeHighlight/Themes'

class Code extends Component {
  render() {
    let { language, value } = this.props
    let block = {
      values: {
        code: value,
        theme: Themes.SOLARIZED_LIGHT,
        language: language.toUpperCase(),
      },
    }

    return (
      <CodeHighlight block={block} />
    )
  }
}

export default Code
