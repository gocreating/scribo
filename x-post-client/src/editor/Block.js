import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import { SortableElement } from 'react-sortable-hoc'
import BlockToolbar from './BlockToolbar'

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
              {text}
            </Grid.Column>
            <Grid.Column width={2}>
              {text}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <BlockToolbar />
      </div>
    )
  }
}

export default SortableElement(Block)
