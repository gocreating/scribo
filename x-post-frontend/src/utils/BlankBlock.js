import React from 'react'
import { Container, Header, Button } from 'semantic-ui-react'

let BlankBlock = () => (
  <Container textAlign="center">
    <Header as="h2">
      No Content
      <Header.Subheader>
        You don't have an block now. Please add a new block.
      </Header.Subheader>
    </Header>
    <Button
      color="yellow"
      onClick={this.initBlock}
    >
      Add the first block
    </Button>
  </Container>
)

export default BlankBlock
