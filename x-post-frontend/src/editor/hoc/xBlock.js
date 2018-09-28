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
        insertBlockBeforeIndex,
        idx,
      } = this.props

      insertBlockBeforeIndex(
        idx,
        type,
        defaultValues
      )
    }

    handleAppendClick = () => {
      let {
        insertBlockBeforeIndex,
        idx,
      } = this.props

      insertBlockBeforeIndex(
        idx + 1,
        type,
        defaultValues
      )
    }

    handleRemoveClick = () => {
      let { removeBlockByIndex, idx } = this.props

      removeBlockByIndex(idx)
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
      let {
        block,
        formValues,
      } = this.props

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
