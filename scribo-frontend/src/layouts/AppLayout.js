import React from 'react'
import { Helmet } from 'react-helmet'
import { Segment, Container, Divider } from 'semantic-ui-react'
import Navigation from './Navigation'
import PageLoading from '../components/PageLoading'
import Footer from './Footer'
import '../semantic/dist/semantic.min.css'
import './AppLayout.css'

const DEFAULT_TITLE = 'Scribo'

let AppLayout = ({
  title, titleSuffix, placeholder, container, loading, children,
}) => (
  <Segment basic style={{ padding: 0 }}>
    <Helmet>
      <title>
        {`${title}${title !== DEFAULT_TITLE ? titleSuffix : ''}`}
      </title>
    </Helmet>
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
  title: DEFAULT_TITLE,
  titleSuffix: ' - Scribo',
  container: true,
}

export default AppLayout
