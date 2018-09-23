import React, { Component } from 'react'
import { Grid, Form, TextArea } from 'semantic-ui-react'
import { withFormik } from 'formik'
import xBlock from '../../hoc/xBlock'
import BlockTypes from '../../../constants/BlockTypes'
import PlainText from './PlainText'

class PlainTextEditor extends Component {
  componentWillUpdate(nextProps) {
    let cp = this.props
    let np = nextProps

    if (cp.values.text !== np.values.text) {
      cp.updateValue(np.values.text)
    }
  }

  renderPreview = () => {
    let { value } = this.props

    return (
      <PlainText value={value} />
    )
  }

  renderEditor = () => {
    let { values, handleChange } = this.props

    return (
      <Form>
        <TextArea
          name="text"
          onChange={handleChange}
          value={values.text}
          placeholder="Write something..."
          rows={1}
          autoHeight
          className="plaintext editor web-font"
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
            {preview && this.renderPreview()}
            {!preview && this.renderEditor()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default xBlock({
  type: BlockTypes.PLAIN_TEXT,
  defaultValue: '',
})(withFormik({
  mapPropsToValues: (props) => ({
    text: props.value,
  }),
})(PlainTextEditor))
