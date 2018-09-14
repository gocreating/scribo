import React, { Component } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import BlockToolbar from '../BlockToolbar'
import { XEditorContext } from '../XEditor'

let xBlock = (config) => (WrappedComponent) => {
  let {
    type,
    defaultValue,
  } = config

  class BlockContainer extends Component {
    handlePreviewClick = () => {
      let {
        setPreviewByIndex,
        idx,
        preview,
      } = this.props

      setPreviewByIndex(idx, !preview)
    }

    handlePrependClick = () => {
      let { insertBlockBeforeIndex, idx } = this.props

      insertBlockBeforeIndex(idx, type, defaultValue)
    }

    handleAppendClick = () => {
      let { insertBlockBeforeIndex, idx } = this.props

      insertBlockBeforeIndex(idx + 1, type, defaultValue)
    }

    handleRemoveClick = () => {
      let { removeBlockByIndex, idx } = this.props

      removeBlockByIndex(idx)
    }

    updateValue = (value) => {
      let { setValueByIndex, idx } = this.props

      setValueByIndex(idx, value)
    }

    render() {
      let { preview, value } = this.props

      return (
        <div className="block-container">
          <WrappedComponent
            preview={preview}
            value={value}
            updateValue={this.updateValue}
          />
          <BlockToolbar
            preview={preview}
            onPreviewClick={this.handlePreviewClick}
            onPrependClick={this.handlePrependClick}
            onAppendClick={this.handleAppendClick}
            onRemoveClick={this.handleRemoveClick}
          />
        </div>
      )
    }
  }

  let BlockContainerWithCtx = (props) => (
    <XEditorContext.Consumer>
      {(ctx) => (<BlockContainer {...ctx} {...props} />)}
    </XEditorContext.Consumer>
  )

  return SortableElement(BlockContainerWithCtx)
}

export default xBlock
