import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'
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
      let { block, dragHandleProps } = this.props
      let blockWithDefaultValues = {
        ...block,
        values: {
          ...config.defaultValues,
          ...block.values,
        }
      }

      return (
        <div className="block-container">
          <WrappedComponent
            block={blockWithDefaultValues}
            autoUpdateValues={this.autoUpdateValues}
            // injected context helpers
            updateValues={this.updateValues}
            // redux-form props
            form={block.id}
            initialValues={block.values}
            enableReinitialize
          />
          <BlockToolbar
            dragHandleProps={dragHandleProps}
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
      {(ctx) => (
        <Draggable
          draggableId={props.block.id}
          index={props.idx}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <BlockContainer
                dragHandleProps={provided.dragHandleProps}
                {...ctx}
                {...props}
              />
            </div>
          )}
        </Draggable>
      )}
    </XEditorContext.Consumer>
  )

  return BlockContainerWithCtx
}

export default xBlock
