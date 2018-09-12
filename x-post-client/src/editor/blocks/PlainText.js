import React, { Component } from 'react'
import { Grid, Form, TextArea } from 'semantic-ui-react'
import xBlock from '../hoc/xBlock'
import BlockTypes from '../../constants/BlockTypes'

class PlainText extends Component {
  renderContent = () => {
    let { value } = this.props

    return value
  }

  renderEditor = () => {
    return (
      <Form>
        <TextArea
          placeholder="Write something..."
        />
      </Form>
    )
  }

  render() {
    let { preview } = this.props

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {
              preview ?
              this.renderContent():
              this.renderEditor()
            }
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
