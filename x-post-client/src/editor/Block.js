import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { SortableElement } from 'react-sortable-hoc'
import BlockToolbar from './BlockToolbar'
import { XEditorContext } from './XEditor'

class Block extends Component {
  handlePrependClick = () => {
    let { insertBlockBeforeIndex, idx } = this.props

    insertBlockBeforeIndex(idx, 'haha')
  }

  handleAppendClick = () => {
    let { insertBlockBeforeIndex, idx } = this.props

    insertBlockBeforeIndex(idx + 1, 'hahaha')
  }

  handleRemoveClick = () => {
    let { removeBlockByIndex, idx } = this.props

    removeBlockByIndex(idx)
  }

  render() {
    let { value } = this.props
    let { text } = value

    return (
      <div className="block">
        <Grid>
          <Grid.Row>
            <Grid.Column width={7}>
              {text}
            </Grid.Column>
            <Grid.Column width={7}>
              {text}
            </Grid.Column>
            <Grid.Column width={2}>
              {text}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <BlockToolbar
          onPrependClick={this.handlePrependClick}
          onAppendClick={this.handleAppendClick}
          onRemoveClick={this.handleRemoveClick}
        />
      </div>
    )
  }
}

export default SortableElement((props) => (
  <XEditorContext.Consumer>
    {(ctx) => (<Block {...ctx} {...props} />)}
  </XEditorContext.Consumer>
))
