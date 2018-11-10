import React from 'react'
import { connect } from 'react-redux'
import { Menu, Container, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { logoutApiRequest } from '../ducks/user'
import { selectors } from '../ducks/auth'
import './Navigation.scss'

let Navigation = ({ isAuth, loggedUsername, logout, push }) => (
  <div className="navigation">
    <Container>
      <Menu borderless stackable attached="top" color="orange">
        <Menu.Item header>
          <Link to="/">
            <img
              src={process.env.PUBLIC_URL + '/img/scribo.svg'}
              style={{ height: 36 }}
              alt="logo"
            />
          </Link>
        </Menu.Item>
        {isAuth && (
          <Menu.Item name="My Blog" as={Link} to={`/@${loggedUsername}`} />
        )}
        <Menu.Item name="Donate to Us" as={Link} to="/donation" />
        <Menu.Item name="Contact" as={Link} to="/contact" />
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
      </Menu>
    </Container>
  </div>
)

export default connect(({ auth }) => ({
  isAuth: selectors.getIsAuth(auth),
  loggedUsername: selectors.getLoggedUser(auth).username,
}), {
  logout: logoutApiRequest,
  push,
})(Navigation)
