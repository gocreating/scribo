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
        <Menu.Item name="贊助" as={Link} to="/donation" />
        <Menu.Item name="意見回饋" as={Link} to="/contact" />
        <Menu.Menu position="right">
          {isAuth && (
            <Menu.Item name="我的部落格" as={Link} to={`/@${loggedUsername}`} />
          )}
          {isAuth && (
            <Menu.Item name="撰寫新文章" as={Link} to="/post/new" />
          )}
          {isAuth && (
            <Menu.Item
              onClick={() => {
                logout()
                push('/user/signin')
              }}
            >
              登出
            </Menu.Item>
          )}
          {!isAuth && (
            <Menu.Item as={Link} to="/user/signin">登入</Menu.Item>
          )}
          {!isAuth && (
            <Menu.Item>
              <Button primary as={Link} to="/user/signup">註冊</Button>
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
