import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'

let SignupForm= ({ onSubmit, handleSubmit }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Form.Field>
      <label>Email / Username</label>
      <Field
        name="emailOrUsername"
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
    <Button basic>Signin</Button>
  </Form>
)

export default reduxForm({
  form: FormTypes.USER_SIGNIN,
  initialValues: {
    emailOrUsername: '',
    password: '',
  },
})(SignupForm)
