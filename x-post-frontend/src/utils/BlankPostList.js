import React from 'react'
import { Container, Header, Button } from 'semantic-ui-react'

let BlankBlock = ({ onInitClick }) => (
  <Container textAlign="center">
    <Header as="h2">
      No Post
      <Header.Subheader>
        {'You don\'t have any post now.'}
      </Header.Subheader>
    </Header>
    <Button
      color="yellow"
      onClick={onInitClick}
    >
      Create your first post now
    </Button>
  </Container>
)

export default BlankBlock
