import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import propsToolbar from '../../hoc/propsToolbar'
import BlockTypes from '../../../constants/BlockTypes'
import CodeHighlight from './CodeHighlight'
import CodeHighlightMenu from './CodeHighlightMenu'
import Themes from './Themes'
import Languages from './Languages'
import TextArea from '../../../fields/TextArea'

class CodeHighlightEditor extends Component {
  renderPreview = () => (
    <CodeHighlight block={this.props.block} />
  )

  renderEditor = () => {
    let { autoUpdateValues } = this.props

    return (
      <Form>
        <Field
          name="code"
          component={TextArea}
          onChange={autoUpdateValues}
          placeholder="Put your code here"
          rows={1}
          autoHeight
          className="code-highlight editor web-font"
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
    type: BlockTypes.CODE_HIGHLIGHT,
    defaultValues: {
      code: '',
      theme: Themes.SOLARIZED_LIGHT,
      language: Languages.DEFAULT,
    },
  }),
  propsToolbar({
    Menu: CodeHighlightMenu,
  }),
  reduxForm()
)
export default enhance(CodeHighlightEditor)
