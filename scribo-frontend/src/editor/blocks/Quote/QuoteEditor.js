import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import propsToolbar from '../../hoc/propsToolbar'
import BlockTypes from '../../../constants/BlockTypes'
import Quote from './Quote'
import QuoteMenu from './QuoteMenu'
import TextAreaAutoSize from '../../../fields/TextAreaAutoSize'

class QuoteEditor extends Component {
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  renderPreview = () => (
    <Quote block={this.props.block} />
  )

  renderEditor = () => {
    let { block, autoUpdateValues } = this.props

    return (
      <Form className="quote editor">
        <Field
          name="text"
          component={TextAreaAutoSize}
          onChange={autoUpdateValues}
          placeholder="輸入引文"
          className="text web-font"
        />
        {block.values.isShowCite && (
          <Field
            name="cite"
            component={TextAreaAutoSize}
            onChange={autoUpdateValues}
            placeholder="輸入出處"
            onKeyPress={this.handleKeyPress}
            className="cite web-font"
          />
        )}
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
    type: BlockTypes.QUOTE,
    defaultValues: {
      text: '',
      isShowCite: false,
      cite: '',
    },
  }),
  propsToolbar({
    Menu: QuoteMenu,
  }),
  reduxForm()
)
export default enhance(QuoteEditor)
