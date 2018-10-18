import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'
import XEditor from '../../editor/XEditor'

class NewOrEditForm extends Component {
  static propTypes = {
    onInitialize: PropTypes.func,
    onSubmit: PropTypes.func,
    initialize: PropTypes.func,
    handleSubmit: PropTypes.func,
  }

  xeditor = React.createRef()

  componentDidMount() {
    let { onInitialize } = this.props

    if (onInitialize) {
      onInitialize(this.handleInitialize)
    }
  }

  handleInitialize = (post) => {
    let { initialize } = this.props
    let { blocks, ...formValues } = post

    initialize(formValues)
    this.xeditor.current.setBlocks(blocks)
  }

  handleSubmit = (targetConsumerFn) => (data) => {
    let blocks = this.xeditor.current
      .getBlocks()
      .map(block => ({
        id: block.id,
        type: block.type,
        values: block.values,
      }))

    targetConsumerFn({
      ...data,
      blocks,
    })
  }

  render() {
    let {
      onCreate,
      onSave,
      onUpdate,
      handleSubmit,
    } = this.props

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
        {process.env.NODE_ENV === 'development' && (
          <Button basic onClick={() => {
            console.log(
              this.xeditor.current.getBlocks()
            )
          }}>
            Debug
          </Button>
        )}
        {onCreate && (
          <Button basic onClick={handleSubmit(this.handleSubmit(onCreate))}>
            Create
          </Button>
        )}
        {onSave && (
          <Button basic onClick={handleSubmit(this.handleSubmit(onSave))}>
            Save
          </Button>
        )}
        {onUpdate && (
          <Button basic onClick={handleSubmit(this.handleSubmit(onUpdate))}>
            Update
          </Button>
        )}
      </Form>
    )
  }
}

export default reduxForm({
  form: FormTypes.POST_NEW_OR_EDIT,
  initialValues: {
    title: '',
  },
})(NewOrEditForm)
