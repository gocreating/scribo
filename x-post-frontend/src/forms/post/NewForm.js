import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'
import XEditor from '../../editor/XEditor'

class NewForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  xeditor = React.createRef()

  handleSubmit = (data) => {
    let { onSubmit } = this.props
    let blocks = this.xeditor.current
      .getBlocks()
      .map(block => ({
        id: block.id,
        type: block.type,
        values: block.values,
      }))

    onSubmit({
      ...data,
      blocks,
    })
  }

  render() {
    let { handleSubmit } = this.props

    return (
      <Form as="div">
        <Form.Field>
          <Field
            name="title"
            component={Input}
            type="text"
            placeholder="Title"
            size="massive"
          />
        </Form.Field>
        <Form.Group>
          <Form.Field width={16}>
            <XEditor ref={this.xeditor} />
          </Form.Field>
        </Form.Group>
        <Button onClick={() => {
          console.log(
            this.xeditor.current.getBlocks()
          )
        }}>
          Debug
        </Button>
        <Button onClick={handleSubmit(this.handleSubmit)}>
          Create
        </Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: FormTypes.POST_NEW,
  initialValues: {
    title: '',
  },
})(NewForm)
