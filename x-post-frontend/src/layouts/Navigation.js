import React from 'react'
import { Grid, Menu, Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

let Navigation = () => (
  <Grid>
    <Grid.Row>
      <Grid.Column>
        <Menu borderless stackable attached="top" color="orange">
          <Container>
            <Menu.Item header>
              <Link to="/">
                <img
                  src="/img/x-post.png"
                  style={{ height: 32 }}
                  alt="logo"
                />
              </Link>
            </Menu.Item>
            <Menu.Item name="Home" as={Link} to="/" />
            <Menu.Item name="New Post" as={Link} to="/post/new" />
          </Container>
        </Menu>
      </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default Navigation
