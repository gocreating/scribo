import React, { Component } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import BlockToolbar from '../BlockToolbar'
import { XEditorContext } from '../XEditor'

let xBlock = (config) => (WrappedComponent) => {
  let {
    type,
    defaultValues,
  } = config

  class BlockContainer extends Component {
    handlePreviewClick = () => {
      let {
        setPreviewByIndex,
        idx,
        block,
      } = this.props

      setPreviewByIndex(idx, !block.preview)
    }

    handlePrependClick = () => {
      let {
        createBlock,
        insertBlockBeforeIndex,
        idx,
      } = this.props
      let block = createBlock(type, defaultValues)

      insertBlockBeforeIndex(idx, block)
    }

    handleAppendClick = () => {
      let {
        createBlock,
        insertBlockBeforeIndex,
        idx,
      } = this.props
      let block = createBlock(type, defaultValues)

      insertBlockBeforeIndex(idx + 1, block)
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