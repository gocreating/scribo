import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { SortableElement } from 'react-sortable-hoc'
import BlockHandle from './BlockHandle'

class Block extends Component {
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
        <div className="toolbar">
          <BlockHandle />
        </div>
      </div>
    )
  }
}

export default SortableElement(Block)
