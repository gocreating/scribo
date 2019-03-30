import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import AppLayout from '../../layouts/AppLayout'
import SignupForm from '../../forms/user/SignupForm'
import { signupApiRequest } from '../../ducks/user'
import { selectors as userSelector } from '../../ducks/user'

let NewPage = ({ signup, isSubmitting }) => (
  <AppLayout placeholder title="註冊">
    <Segment basic>
      <Header>
        註冊Scribo帳戶
      </Header>
      <SignupForm
        isSubmitting={isSubmitting}
        onSubmit={(data) => {
          signup(data, null, (result) => {
            alert(result.error.message)
          })
        }}
      />
    </Segment>
  </AppLayout>
)

NewPage.propTypes = {
  signup: PropTypes.func,
}

export default connect(({ users }) => ({
  isSubmitting: userSelector.getSignupContext(users).isPending,
}), {
  signup: signupApiRequest,
})(NewPage)
