import React from 'react'
import { Container, Grid, Segment, List, Header, Icon } from 'semantic-ui-react'
import './Footer.scss'

let Footer = () => (
  <Container>
    <Grid
      columns={2}
      stackable
      padded
      textAlign="left"
      className="footer"
    >
      <Grid.Row>
        <Grid.Column>
          <Segment basic compact>
            <List horizontal size="big">
              <List.Item><Icon name="facebook" /></List.Item>
              <List.Item><Icon name="instagram" /></List.Item>
              <List.Item><Icon name="linkedin" /></List.Item>
              <List.Item><Icon name="youtube" /></List.Item>
              <List.Item><Icon name="pinterest square" /></List.Item>
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment basic compact>
            <List horizontal size="big">
              <List.Item><Icon name="html5" /></List.Item>
              <List.Item><Icon name="css3" /></List.Item>
              <List.Item><Icon name="js" /></List.Item>
              <List.Item><Icon name="node js" /></List.Item>
              <List.Item><Icon name="react" /></List.Item>
              <List.Item><Icon name="sass" /></List.Item>
              <List.Item><Icon name="github" /></List.Item>
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <Segment basic compact>
            <Header as="h3">
              Comprehensive
            </Header>
            <List>
              <List.Item>Blog</List.Item>
              <List.Item>News</List.Item>
              <List.Item>Resume</List.Item>
              <List.Item>Content Sharing</List.Item>
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment basic compact>
            <Header as="h3">
              Professional
            </Header>
            <List>
              <List.Item>Markdown</List.Item>
              <List.Item>Flow Chart</List.Item>
              <List.Item>Code Block</List.Item>
              <List.Item>Math Support</List.Item>
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
)

export default Footer
