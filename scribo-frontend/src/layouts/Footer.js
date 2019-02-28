import React from 'react'
import { Container, Grid, Segment, List, Header } from 'semantic-ui-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faYoutube,
  faPinterest,
  faHtml5,
  faCss3,
  faJs,
  faNodeJs,
  faReact,
  faSass,
  faGithub,
} from '@fortawesome/free-brands-svg-icons'
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
              <List.Item><FontAwesomeIcon icon={faFacebook} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faInstagram} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faLinkedin} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faYoutube} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faPinterest} /></List.Item>
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment basic compact>
            <List horizontal size="big">
              <List.Item><FontAwesomeIcon icon={faHtml5} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faCss3} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faJs} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faNodeJs} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faReact} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faSass} /></List.Item>
              <List.Item><FontAwesomeIcon icon={faGithub} /></List.Item>
            </List>
          </Segment>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <Segment basic compact>
            <Header as="h3">
              多元用途
            </Header>
            <List>
              <List.Item>部落格</List.Item>
              <List.Item>新聞</List.Item>
              <List.Item>履歷</List.Item>
              <List.Item>內容分享</List.Item>
            </List>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment basic compact>
            <Header as="h3">
              專業模組
            </Header>
            <List>
              <List.Item>Markdown</List.Item>
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
