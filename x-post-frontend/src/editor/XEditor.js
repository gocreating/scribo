import React, { Component } from 'react'
import shortid from 'shortid'
import { Container, Header, Button } from 'semantic-ui-react'
import { arrayMove } from 'react-sortable-hoc'
import BlockTypes from '../constants/BlockTypes'
import BlockList from './BlockList'
import './XEditor.css'

export let XEditorContext = React.createContext()

class XEditor extends Component {
  state = {
    blocks: [
      {
        id: shortid.generate(),
        type: BlockTypes.PLAIN_TEXT,
        preview: false,
        values: {
          text: 'xx',
        },
      },
    ],
  }

  initBlock = () => {
    let block = this.createBlock(
      BlockTypes.PLAIN_TEXT, {
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
    let block = this.state.blocks[idx];
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
    this.setBlockPropertiesByIndex(
      idx, {
        values: values,
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

  onSortEnd = ({ oldIndex, newIndex }) => {
    let { blocks } = this.state

    this.setState({
      blocks: arrayMove(blocks, oldIndex, newIndex),
    })
  }

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
        {showContent ? (
          <div className="blocklist">
            <BlockList
              blocks={blocks}
              onSortEnd={this.onSortEnd}
              helperClass="dragging"
              lockAxis="y"
              useDragHandle
              lockToContainerEdges
            />
          </div>
        ) : (
          <Container textAlign="center">
            <Header as="h2">
              No Content
              <Header.Subheader>
                You don't have an block now. Please add a new block.
              </Header.Subheader>
            </Header>
            <Button
              color="yellow"
              onClick={this.initBlock}
            >
              Add the first block
            </Button>
          </Container>
        )}
        <pre>
          {JSON.stringify(this.state.blocks, null, 2)}
        </pre>
      </XEditorContext.Provider>
    )
  }
}

export default XEditor