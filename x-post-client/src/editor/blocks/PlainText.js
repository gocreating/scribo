import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import xBlock from '../hoc/xBlock'
import BlockTypes from '../../constants/BlockTypes'

class PlainText extends Component {
  render() {
    let { value } = this.props

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={7}>
            {value}
          </Grid.Column>
          <Grid.Column width={7}>
            {value}
          </Grid.Column>
          <Grid.Column width={2}>
            {value}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default xBlock({
  type: BlockTypes.PLAIN_TEXT,
  defaultValue: '',
})(PlainText)
