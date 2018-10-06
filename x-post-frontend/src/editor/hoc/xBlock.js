import React, { Component } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import BlockToolbar from '../BlockToolbar'
import { XEditorContext } from '../XEditor'

let xBlock = (config) => (WrappedComponent) => {
  class BlockContainer extends Component {
    handlePreviewClick = () => {
      let {
        setPreviewByIndex,
        idx,
        block,
      } = this.props

      setPreviewByIndex(idx, !block.preview)
    }

    handlePrependClick = (blockType, insertValues, e) => {
      let {
        createBlock,
        insertBlockBeforeIndex,
        idx,
      } = this.props
      let newBlock = createBlock(
        blockType,
        insertValues
      )

      insertBlockBeforeIndex(idx, newBlock)
    }

    handleAppendClick = (blockType, insertValues, e) => {
      let {
        createBlock,
        insertBlockBeforeIndex,
        idx,
      } = this.props
      let newBlock = createBlock(
        blockType,
        insertValues
      )

      insertBlockBeforeIndex(idx + 1, newBlock)
    }

    handleRemoveClick = () => {
      let { removeBlockByIndex, idx } = this.props

      if (window.confirm('Sure?')) {
        removeBlockByIndex(idx)
      }
    }

    updateValues = (values) => {
      let { setValuesByIndex, idx } = this.props

      setValuesByIndex(idx, values)
    }

    // helper for handling redux-form Field onChange
    autoUpdateValues = (e, newValue, previousValue, name) => {
      let { block } = this.props

      this.updateValues({
        ...block.values,
        [name]: newValue,
      })
    }

    render() {
      let { block } = this.props

      return (
        <div className="block-container">
          <WrappedComponent
            block={block}
            autoUpdateValues={this.autoUpdateValues}
            // injected context helpers
            updateValues={this.updateValues}
            // redux-form props
            form={block.id}
            initialValues={block.values}
            enableReinitialize
          />
          <BlockToolbar
            preview={block.preview}
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
