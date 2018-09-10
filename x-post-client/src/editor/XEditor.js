import React, { Component } from 'react'
import { Grid, Form, TextArea } from 'semantic-ui-react'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc'
import '@fortawesome/fontawesome-free/css/all.css'
import './XEditor.css'

let DragHandle = SortableHandle(() => (
  <i className="handle fas fa-arrows-alt"></i>
))

class Block extends Component {
  render() {
    let { value } = this.props
    let { text } = value

    return (
      <div className="block">
        <Grid>
          <Grid.Row>
            <Grid.Column width={1}>
              <DragHandle />
            </Grid.Column>
            <Grid.Column width={13}>
              <Form>
                <TextArea defaultValue={text} />
              </Form>
            </Grid.Column>
            <Grid.Column width={2}>
              {text}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}
let SortableBlock = SortableElement(Block)

let BlockList = SortableContainer(({ blocks }) => {
  return (
    <div>
      {blocks.map((value, index) => (
        <SortableBlock
          key={`item-${index}`}
          index={index}
          value={value}
        />
      ))}
    </div>
  )
})

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
      <div>
        <BlockList
          blocks={blocks}
          onSortStart={this.onSortStart}
          onSortEnd={this.onSortEnd}
          useDragHandle
          helperClass="dragging"
        />
      </div>
    )
  }
}

export default XEditor
