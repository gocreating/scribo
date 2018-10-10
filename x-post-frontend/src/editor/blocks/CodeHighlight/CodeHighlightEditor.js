import React, { Component } from 'react'
import { compose } from 'recompose'
import { Field, reduxForm } from 'redux-form'
import { Grid, Form } from 'semantic-ui-react'
import xBlock from '../../hoc/xBlock'
import propsToolbar from '../../hoc/propsToolbar'
import BlockTypes from '../../../constants/BlockTypes'
import CodeHighlight from './CodeHighlight'
import Themes from './Themes'
import Languages from './Languages'
import TextArea from '../../../fields/TextArea'

class CodeHighlightEditor extends Component {
  renderPreview = () => (
    <CodeHighlight block={this.props.block} />
  )

  renderEditor = () => {
    let { block, autoUpdateValues } = this.props

    return (
      <Form>
        <Field
          name="code"
          component={TextArea}
          onChange={autoUpdateValues}
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
    },
  }),
  propsToolbar({
    items: [{
      label: 'Solarized Light',
      propsMap: { theme: Themes.SOLARIZED_LIGHT },
    }, {
      label: 'Okaidia',
      propsMap: { theme: Themes.OKAIDIA },
    }, {
      label: 'Markup',
      propsMap: { language: Languages.MARKUP },
    }, {
      label: 'CSS',
      propsMap: { language: Languages.CSS },
    }, {
      label: 'C-like',
      propsMap: { language: Languages.C_LIKE },
    }, {
      label: 'Javascript',
      propsMap: { language: Languages.JAVASCRIPT },
    }, {
      label: 'Json',
      propsMap: { language: Languages.JSON },
    }, {
      label: 'React JSX',
      propsMap: { language: Languages.JSX },
    }],
  }),
  reduxForm()
)
export default enhance(CodeHighlightEditor)
