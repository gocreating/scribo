import React from 'react'
import { Grid, Container, Divider } from 'semantic-ui-react'
import Navigation from './Navigation'
import Footer from './Footer'
import '../semantic/dist/semantic.min.css'
import './AppLayout.css'

let AppLayout = ({ placeholder, children }) => (
  <div>
    <Navigation />
    <Grid className="app-content">
      <Grid.Row>
        <Grid.Column>
          {placeholder === true && (
            <Divider hidden />
          )}
          {placeholder !== true && placeholder}
          <Container>
            {children}
          </Container>
        </Grid.Column>
      </Grid.Row>
      <Divider hidden section />
    </Grid>
    <Footer />
  </div>
)

export default AppLayout
