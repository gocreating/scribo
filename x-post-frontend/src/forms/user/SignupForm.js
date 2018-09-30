import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'

let SignupForm= ({ onSubmit, handleSubmit }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Form.Field>
      <label>Email</label>
      <Field
        name="email"
        component={Input}
        type="text"
      />
    </Form.Field>
    <Form.Field>
      <label>Password</label>
      <Field
        name="password"
        component={Input}
        type="password"
      />
    </Form.Field>
    <Button>Signup</Button>
  </Form>
)

export default reduxForm({
  form: FormTypes.USER_SIGNUP,
  initialValues: {
    email: '',
    password: '',
  },
})(SignupForm)
