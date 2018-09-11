import React, { Component } from 'react'
import { Container, Header, Button } from 'semantic-ui-react'
import { arrayMove } from 'react-sortable-hoc'
import BlockList from './BlockList'
import './XEditor.css'

export let XEditorContext = React.createContext()

class XEditor extends Component {
  state = {
    blocks: [
      { text: 'Item 1' },
      { text: 'Item 2' },
      { text: 'Item 3' },
      { text: 'Item 4' },
      { text: 'Item 5' },
      { text: 'Item 6' },
    ],
  }

  initBlock = () => {
    this.insertBlockBeforeIndex(0, 'Let\'s go!')
  }

  insertBlockBeforeIndex = (idx, text) => {
    this.setState({
      ...this.state,
      blocks: [
        ...this.state.blocks.slice(0, idx),
        { text: text },
        ...this.state.blocks.slice(idx)
      ],
    })
  }

  removeBlockByIndex = (idx) => {
    if (window.confirm('Sure?')) {
      this.setState({
        ...this.state,
        blocks: [
          ...this.state.blocks.splice(0, idx),
          ...this.state.blocks.splice(1)
        ],
      })
    }
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

    return (
      <XEditorContext.Provider value={{
        insertBlockBeforeIndex: this.insertBlockBeforeIndex,
        removeBlockByIndex: this.removeBlockByIndex,
      }}>
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
      </XEditorContext.Provider>
    )
  }
}

export default XEditor
