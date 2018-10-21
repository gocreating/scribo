import React from 'react'
import { connect } from 'react-redux'
import { Grid, Menu, Container, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { logoutApiRequest } from '../ducks/user'
import { selectors } from '../ducks/auth'
import './Navigation.css'

let Navigation = ({ isAuth, logout, push }) => (
  <Grid className="navigation">
    <Grid.Row>
      <Grid.Column>
        <Menu borderless stackable attached="top" color="orange">
          <Container>
            <Menu.Item header>
              <Link to="/">
                <img
                  src={process.env.PUBLIC_URL + '/img/x-post.png'}
                  style={{ height: 32 }}
                  alt="logo"
                />
              </Link>
            </Menu.Item>
            <Menu.Menu position="right">
              {isAuth && (
                <Menu.Item name="New Post" as={Link} to="/post/new" />
              )}
              {isAuth && (
                <Menu.Item
                  onClick={() => {
                    logout()
                    push('/user/signin')
                  }}
                >
                  Logout
                </Menu.Item>
              )}
              {!isAuth && (
                <Menu.Item as={Link} to="/user/signin">Signin</Menu.Item>
              )}
              {!isAuth && (
                <Menu.Item>
                  <Button primary as={Link} to="/user/signup">Sign Up</Button>
                </Menu.Item>
              )}
            </Menu.Menu>
          </Container>
        </Menu>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default connect(({ auth }) => ({
  isAuth: selectors.getIsAuth(auth),
}), {
  logout: logoutApiRequest,
  push,
})(Navigation)
