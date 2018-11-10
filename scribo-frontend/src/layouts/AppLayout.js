import React from 'react'
import { Segment, Container, Divider } from 'semantic-ui-react'
import Navigation from './Navigation'
import PageLoading from '../components/PageLoading'
import Footer from './Footer'
import '../semantic/dist/semantic.min.css'
import './AppLayout.css'

let AppLayout = ({ placeholder, container, loading, children }) => (
  <Segment basic style={{ padding: 0 }}>
    <div className="app-content">
      <Navigation />
      <PageLoading active={loading} />
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
