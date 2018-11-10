import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import BlockTypes from '../../../constants/BlockTypes'
import Markdown from './Markdown'
import TextAreaAutoSize from '../../../fields/TextAreaAutoSize'

class MarkdownEditor extends Component {
  renderPreview = () => (
    <Markdown block={this.props.block} />
  )

  renderEditor = () => {
    let { autoUpdateValues } = this.props

    return (
      <Form>
        <Field
          name="text"
          component={TextAreaAutoSize}
          onChange={autoUpdateValues}
          placeholder="Write markdown here"
          className="markdown editor web-font"
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
    type: BlockTypes.MARKDOWN,
    defaultValues: {
      text: '',
    },
  }),
  reduxForm()
)
export default enhance(MarkdownEditor)
