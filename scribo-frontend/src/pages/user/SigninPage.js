import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import AppLayout from '../../layouts/AppLayout'
import SigninForm from '../../forms/user/SigninForm'
import {
  signinApiRequest,
  selectors as userSelector,
} from '../../ducks/user'

let SigninPage = ({ signin, isSubmitting }) => (
  <AppLayout placeholder title="登入">
    <Segment basic>
      <Header>
        登入Scribo
      </Header>
      <SigninForm
        onSubmit={data => signin(data, null, (result) => {
          alert(result.error.message)
        })}
        isSubmitting={isSubmitting}
      />
    </Segment>
  </AppLayout>
)

SigninPage.propTypes = {
  signin: PropTypes.func,
  isSubmitting: PropTypes.bool,
}

export default connect(({ users }) => ({
  isSubmitting: userSelector.getSigninContext(users).isPending,
}), {
  signin: signinApiRequest,
})(SigninPage)
