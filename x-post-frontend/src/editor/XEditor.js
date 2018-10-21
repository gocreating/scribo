import React, { Component } from 'react'
import shortid from 'shortid'
import { DragDropContext } from 'react-beautiful-dnd'
import BlockTypes from '../constants/BlockTypes'
import EditorRenderer from './renderers/EditorRenderer'
import BlankBlock from '../utils/BlankBlock'
import reorder from './utils/reorder'
import './XEditor.css'

export let XEditorContext = React.createContext()

class XEditor extends Component {
  state = {
    blocks: [],
  }

  getBlocks = () => {
    return this.state.blocks
  }

  setBlocks = (blocks) => {
    this.setState({ blocks: blocks || [] })
  }

  initBlock = () => {
    let block = this.createBlock(
      BlockTypes.PARAGRAPH, {
        text: 'Let\'s go!',
      }
    )
    this.insertBlockBeforeIndex(0, block)
  }

  createBlock = (type, values, rest) => {
    return {
      id: shortid.generate(),
      type,
      values,
      preview: false,
      ...rest,
    }
  }

  setBlockPropertiesByIndex = (idx, properties) => {
    let block = this.state.blocks[idx]
    let newState = {
      ...this.state,
      blocks: [
        ...this.state.blocks.slice(0, idx),
        {
          ...block,
          ...properties,
        },
        ...this.state.blocks.slice(idx + 1)
      ],
    }

    this.setState(newState)
  }

  setPreviewByIndex = (idx, preview) => {
    this.setBlockPropertiesByIndex(
      idx, {
        preview: Boolean(preview),
      }
    )
  }

  setValuesByIndex = (idx, values) => {
    let block = this.state.blocks[idx]

    this.setBlockPropertiesByIndex(
      idx, {
        values: {
          ...block.values,
          ...values,
        },
      }
    )
  }

  insertBlockBeforeIndex = (idx, block) => {
    this.setState({
      ...this.state,
      blocks: [
        ...this.state.blocks.slice(0, idx),
        block,
        ...this.state.blocks.slice(idx)
      ],
    })
  }

  removeBlockByIndex = (idx) => {
    this.setState({
      ...this.state,
      blocks: [
        ...this.state.blocks.splice(0, idx),
        ...this.state.blocks.splice(1)
      ],
    })
  }

  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    if (result.destination.index === result.source.index) {
      return
    }
    this.setState({
      blocks: reorder(
        this.state.blocks,
        result.source.index,
        result.destination.index,
      ),
    })
  };

  render() {
    let { blocks } = this.state
    let showContent = blocks.length > 0
    let blockHelpers = {
      createBlock: this.createBlock,
      setBlockPropertiesByIndex: this.setBlockPropertiesByIndex,
      setPreviewByIndex: this.setPreviewByIndex,
      setValuesByIndex: this.setValuesByIndex,
      insertBlockBeforeIndex: this.insertBlockBeforeIndex,
      removeBlockByIndex: this.removeBlockByIndex,
    }

    return (
      <XEditorContext.Provider value={blockHelpers}>
        <DragDropContext onDragEnd={this.onDragEnd}>
          {showContent && (
            <div className="blocklist">
              <EditorRenderer
                blocks={blocks}
                onSortEnd={this.onSortEnd}
              />
            </div>
          )}
          {!showContent && (
            <BlankBlock onInitClick={this.initBlock} />
          )}
        </DragDropContext>
      </XEditorContext.Provider>
    )
  }
}

export default XEditor
