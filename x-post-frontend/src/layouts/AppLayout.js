import React from 'react'
import { Segment, Container, Divider } from 'semantic-ui-react'
import Navigation from './Navigation'
import Footer from './Footer'
import '../semantic/dist/semantic.min.css'
import './AppLayout.css'

let AppLayout = ({ placeholder, container, children }) => (
  <Segment basic style={{ padding: 0 }}>
    <div className="app-content">
      <Navigation />
      {placeholder === true && (
        <Divider hidden />
      )}
      {placeholder !== true && placeholder}
      {container ? (
        <Container>
          {children}
        </Container>
      ) : (
        children
      )}
      <Divider hidden section />
    </div>
    <Footer />
  </Segment>
)

AppLayout.defaultProps = {
  container: true,
}

export default AppLayout
