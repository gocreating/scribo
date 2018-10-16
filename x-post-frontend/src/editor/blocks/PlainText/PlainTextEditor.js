import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import BlockTypes from '../../../constants/BlockTypes'
import PlainText from './PlainText'
import TextAreaAutoSize from '../../../fields/TextAreaAutoSize'

class PlainTextEditor extends Component {
  renderPreview = () => (
    <PlainText block={this.props.block} />
  )

  renderEditor = () => {
    let { autoUpdateValues } = this.props

    return (
      <Form>
        <Field
          name="text"
          component={TextAreaAutoSize}
          onChange={autoUpdateValues}
          placeholder="Write something..."
          className="plaintext editor web-font"
        />
      </Form>
    )
  }

  render() {
    let { block } = this.props

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            {block.preview && this.renderPreview()}
            {!block.preview && this.renderEditor()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

let enhance = compose(
  xBlock({
    type: BlockTypes.PLAIN_TEXT,
    defaultValues: {
      text: '',
    },
  }),
  reduxForm()
)
export default enhance(PlainTextEditor)
