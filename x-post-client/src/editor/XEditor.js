import React, { Component } from 'react'
import { arrayMove } from 'react-sortable-hoc'
import BlockList from './BlockList'
import './XEditor.css'

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

  onSortStart = ({ node, index, collection }) => {
    this.setState({ sorting: true, target: index })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    let { blocks } = this.state

    this.setState({
      blocks: arrayMove(blocks, oldIndex, newIndex),
    })
  }

  render() {
    let { blocks } = this.state

    return (
      <div className="blocklist">
        <BlockList
          blocks={blocks}
          onSortStart={this.onSortStart}
          onSortEnd={this.onSortEnd}
          helperClass="dragging"
          lockAxis="y"
          useDragHandle
          lockToContainerEdges
        />
      </div>
    )
  }
}

export default XEditor
