import React, { Component } from 'react'
import { Grid, Form, TextArea } from 'semantic-ui-react'
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
            <Grid.Column width={1}>
              <BlockHandle />
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

export default SortableElement(Block)
