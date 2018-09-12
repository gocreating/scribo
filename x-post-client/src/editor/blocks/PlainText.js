import React, { Component } from 'react'
import { Grid, Form, TextArea } from 'semantic-ui-react'
import { withFormik } from 'formik'
import xBlock from '../hoc/xBlock'
import BlockTypes from '../../constants/BlockTypes'
import './PlainText.css'

class PlainText extends Component {
  componentWillUpdate(nextProps) {
    let cp = this.props
    let np = nextProps

    if (cp.values.text !== np.values.text) {
      cp.updateValue(np.values.text)
    }
  }

  renderContent = () => {
    let { value } = this.props

    return (
      <p className="plaintext content web-font">
        {
          value
            .split('\n')
            .map((line, idx) => (
              <span key={`${idx}-${line}`}>
                {line}
                <br/>
              </span>)
            )
        }
      </p>
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
})(withFormik({
  mapPropsToValues: (props) => ({
    text: props.value,
  }),
})(PlainText))
