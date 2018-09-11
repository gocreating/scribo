import React from 'react'
import { Container } from 'semantic-ui-react'
import Navigation from './Navigation'
import 'semantic-ui-css/semantic.min.css'
import './AppLayout.css'

let AppLayout = ({ children }) => (
  <div>
    <Navigation />
    <Container>
      {children}
    </Container>
  </div>
)

export default AppLayout
