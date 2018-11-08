import React from 'react'
import { Container, Header, Button } from 'semantic-ui-react'

let BlankPostList = ({ header, subHeader, buttonText, onInitClick }) => (
  <Container textAlign="center">
    {header && (
      <Header as="h2">
        {header}
        {subHeader && (
          <Header.Subheader>
            {subHeader}
          </Header.Subheader>
        )}
      </Header>
    )}
    {onInitClick && buttonText && (
      <Button
        color="yellow"
        onClick={onInitClick}
      >
        {buttonText}
      </Button>
    )}
  </Container>
)

BlankPostList.defaultProps = {
  header: 'No Post',
  subHeader: 'You don\'t have any post now.',
  buttonText: 'Create your first post now',
}

export default BlankPostList
