import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Form } from 'semantic-ui-react'
import Input from '../../fields/Input'
import FormTypes from '../../constants/FormTypes'

let SignupForm= ({ isSubmitting, onSubmit, handleSubmit }) => (
  <Form onSubmit={handleSubmit(onSubmit)}>
    <Form.Field>
      <label>電子信箱 / 使用者帳號</label>
      <Field
        name="emailOrUsername"
        component={Input}
        type="text"
      />
    </Form.Field>
    <Form.Field>
      <label>密碼</label>
      <Field
        name="password"
        component={Input}
        type="password"
      />
    </Form.Field>
    <Button
      basic
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      登入
    </Button>
  </Form>
)

export default reduxForm({
  form: FormTypes.USER_SIGNIN,
  initialValues: {
    emailOrUsername: '',
    password: '',
  },
})(SignupForm)
