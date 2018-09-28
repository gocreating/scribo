import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import BlockTypes from '../../../constants/BlockTypes'
import PlainText from './PlainText'
import TextArea from '../../../fields/TextArea'

class PlainTextEditor extends Component {
  renderPreview = () => {
    let { block } = this.props

    return (
      <PlainText values={block.values.text} />
    )
  }

  renderEditor = () => {
    let { block, autoUpdateValues } = this.props

    return (
      <Form>
        <Field
          name="text"
          component={TextArea}
          value={block.values.text}
          onChange={autoUpdateValues}
          placeholder="Write something..."
          rows={1}
          autoHeight
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
