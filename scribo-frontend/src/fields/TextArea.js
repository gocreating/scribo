import React, { Component } from 'react'
import { TextArea as SUITextArea } from 'semantic-ui-react'

class TextArea extends Component {
  state = {}

  setRef = textareaRef => this.setState({ textareaRef })

  // https://github.com/Semantic-Org/Semantic-UI-React/blob/master/src/addons/TextArea/TextArea.js
  componentDidUpdate() {
    let { autoHeight } = this.props
    let { textareaRef } = this.state

    if (autoHeight) {
      textareaRef.updateHeight()
    }
  }

  render() {
    let { input, ...rest } = this.props

    return (
      <SUITextArea
        ref={this.setRef}
        {...input}
        {...rest}
      />
    )
  }
}

export default TextArea
